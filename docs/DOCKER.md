# Docker development environment

Use Docker Engine or Docker Desktop in Linux-container mode with Docker Compose v2.
The image includes Node.js 24, Chromium, ffmpeg, fonts, Git, ripgrep, Python, native
build tools, and the Codex, Claude Code, and Gemini CLIs. No host Node.js or Chrome
installation is required. Internet access is needed to build the image, use AI
services, and load the studio's Google Fonts.

## Start the studio

~~~sh
docker compose up --build -d studio
~~~

Open http://localhost:5173. Source edits appear immediately because Compose mounts
this checkout at /workspace. Renders are saved in the checkout's out/ directory.
Linux node_modules live in a separate Docker volume, keeping host dependencies
independent. The studio port is published on localhost only.

~~~sh
docker compose exec studio npm run doctor
docker compose exec studio node render.mjs --scene=scene01_juggling --sheet=1,4,8,12
docker compose exec studio node render.mjs --scene=scene01_juggling --clip=0:2
docker compose exec studio npm run movie
~~~

The doctor reports failures with a cross mark but currently exits successfully even
when a check fails. Inspect its output and out/check/doctor.png; use a short clip
render as an additional end-to-end check.

## Use the AI coding CLIs

Start a persistent tools container, then launch any CLI:

~~~sh
docker compose --profile tools up --build -d
docker compose exec agents codex
docker compose exec agents claude
docker compose exec agents gemini
~~~

For a shell, use docker compose exec agents bash. All three CLIs can edit the mounted
checkout and run the same rendering commands as the studio. Login state and settings
are stored in the agent_home volume, including Claude's ~/.claude.json file.
The tools container does not publish a web port.

For Codex account login in a headless container:

~~~sh
docker compose exec agents codex login --device-auth
~~~

Enable device code login in your account or workspace settings if required, then
open the printed URL on your host and enter the code. For Claude and Gemini, follow
the CLI's login prompts. If account login requires a browser callback that cannot
reach the container, use API-key authentication below.

### API-key authentication

Copy .env.example to .env and fill in the keys for the providers you want to use.
Compose reads this file and injects the keys into the agents service at runtime;
keys are excluded from the image build context and Git. Account-based login does
not require keys. The project mount lets coding agents read checkout files,
including .env; only put credentials there that you intend those agents to access.

For Codex API-key login (the key stays inside the container shell):

~~~sh
docker compose exec agents sh -c 'printenv OPENAI_API_KEY | codex login --with-api-key'
~~~

Claude uses ANTHROPIC_API_KEY. In Gemini, select Use Gemini API Key. After changing
.env, recreate the tools container with docker compose --profile tools up -d agents.

Official setup and authentication references:

- [Codex CLI](https://developers.openai.com/codex/cli/) and [headless authentication](https://developers.openai.com/codex/auth/)
- [Claude Code installation](https://code.claude.com/docs/en/setup)
- [Gemini CLI installation](https://geminicli.com/docs/get-started/installation/) and [authentication](https://geminicli.com/docs/get-started/authentication/)

## Default agent permissions

The agents service installs settings from docker/agent-defaults/ into the persistent
home volume on startup, including volumes created before these defaults were added.
It creates missing settings files and preserves any files that already exist.

- Codex: workspace-write sandbox, on-request approvals, and outbound network access.
- Claude: acceptEdits mode; other actions retain their permission checks.
- Gemini: auto_edit mode; other actions retain their permission checks.

Rebuild and recreate the agents container to enable these defaults:

~~~sh
docker compose --profile tools up --build -d agents
~~~

The templates become ~/.codex/config.toml, ~/.claude/settings.json, and
~/.gemini/settings.json inside the container. If a settings file already exists,
merge the desired values from its template into that file. Template changes apply
automatically only to missing files. Restart the CLI after changing its settings.

## Dependencies and updates

After package.json or package-lock.json changes, stop the services, refresh the shared
dependency volume, and restart them. Rebuilding alone does not replace existing
volume contents:

~~~sh
docker compose --profile tools stop
docker compose run --rm --no-deps studio npm ci
docker compose --profile tools up --build -d
~~~

The AI CLI build arguments default to latest. To pin versions, set CODEX_VERSION,
CLAUDE_VERSION, and GEMINI_VERSION in .env to exact npm versions. To refresh the
CLIs when keeping latest, bypass Docker's cached install layer:

~~~sh
docker compose build --no-cache studio
docker compose --profile tools up -d
~~~

To change the host port, set STUDIO_PORT in .env (for example, 5174).
The container still listens on port 5173. For a standalone image without Compose:

~~~sh
docker build -t safadi-animation-studio:dev .
docker run --rm --init --shm-size=1g -p 127.0.0.1:5173:5173 safadi-animation-studio:dev
~~~

## Container behavior

Processes run as the node user (UID 1000). On Linux hosts, the checkout must be
writable by that user for agents and renders to save files. Chromium is launched
through a container-only wrapper with --no-sandbox because many Docker hosts do
not provide the namespaces required for its internal sandbox. Docker remains the
isolation boundary; the container uses neither privileged mode nor the Docker socket.
Compose gives Chromium 1 GB of shared memory for parallel frame rendering.

~~~sh
docker compose --profile tools down
~~~

This stops containers and preserves dependencies and logins. Adding --volumes also
deletes both named volumes, including saved AI credentials. Output under out/ stays
in the host checkout.
