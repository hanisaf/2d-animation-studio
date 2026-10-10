#!/bin/sh
# Container-only: many Docker hosts cannot run Chromium's namespace sandbox.
# Docker provides the isolation boundary for this renderer.
exec /usr/bin/chromium --no-sandbox "$@"
