#!/bin/sh
set -eu

if [ "${AGENT_CONFIG_DEFAULTS:-0}" = "1" ]; then
    node /opt/agent-defaults/install.mjs
fi

exec "$@"
