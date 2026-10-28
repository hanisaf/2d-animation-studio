# Publishing the arcade

`index.html` is the game directory. Each game lives in its own subfolder with its ready-to-play `index.html`, `style.css`, and `runtime.js`.

## GitHub Pages

1. Commit and push these files to the branch you want to publish.
2. In the GitHub repository, open **Settings → Pages**.
3. Select **Deploy from a branch**, choose your branch, select **/ (root)**, and save.
4. Open the website URL shown by GitHub Pages once deployment finishes. The repository’s root `index.html` asks visitors to choose between the movie studio and the arcade.

GitHub Pages branch publishing supports the repository root or `/docs`; it does not offer `/games` as a source folder. Use the root option above for this layout.

## Other static website hosts

Set the publish directory to `games` with no build command, or upload the contents of `games` to your website’s public folder. Keep each game’s subfolder intact. All links are relative, so the arcade also works under a website subpath.

The existing game bundles are committed and ready to serve. If you edit game source files, rebuild the affected game with `npm run build:game` (Robo Invader) or `npm run build:world-champion` (World Champion) before publishing.
