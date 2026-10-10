# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim

# Set exact npm versions through build arguments to pin the AI tools.
ARG CODEX_VERSION=latest
ARG CLAUDE_VERSION=latest
ARG GEMINI_VERSION=latest

ENV DEBIAN_FRONTEND=noninteractive \
    CHROME=/usr/local/bin/chromium-container \
    FFMPEG=/usr/bin/ffmpeg \
    NPM_CONFIG_PREFIX=/opt/ai \
    PATH=/opt/ai/bin:$PATH \
    DISABLE_AUTOUPDATER=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash build-essential ca-certificates chromium curl ffmpeg \
        fonts-dejavu-core fonts-liberation fonts-noto-color-emoji \
        git less openssh-client python3 ripgrep \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /opt/ai /workspace \
    && chown node:node /opt/ai /workspace \
    && git config --system --add safe.directory /workspace

COPY docker/chromium-container.sh /usr/local/bin/chromium-container
COPY docker/entrypoint.sh /usr/local/bin/studio-entrypoint
COPY docker/agent-defaults/ /opt/agent-defaults/
# Normalize Windows checkout line endings.
RUN sed -i 's/\r$//' /usr/local/bin/chromium-container \
    && sed -i 's/\r$//' /usr/local/bin/studio-entrypoint \
    && chmod 755 /usr/local/bin/chromium-container /usr/local/bin/studio-entrypoint

USER node
WORKDIR /workspace

RUN npm install --global \
        "@openai/codex@${CODEX_VERSION}" \
        "@anthropic-ai/claude-code@${CLAUDE_VERSION}" \
        "@google/gemini-cli@${GEMINI_VERSION}" \
    && npm cache clean --force \
    && codex --version \
    && claude --version \
    && gemini --version

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci && npm cache clean --force
COPY --chown=node:node . .

ENV HOST=0.0.0.0 PORT=5173
EXPOSE 5173
ENTRYPOINT ["/usr/local/bin/studio-entrypoint"]
CMD ["npm", "run", "serve"]
