#!/bin/bash
if [[ -z "${DEBUG_SETTING}" ]]; then
  serve -s build -l 3000
else
  npm run start
fi
