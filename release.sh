#!/usr/bin/env bash

light_blue='\033[1;34m'
reset='\033[0m'

echo -e "${light_blue}\nBuilding web...\n${reset}"

bun run build:web

echo -e "${light_blue}\nPublishing web on EAS...\n${reset}"

bun x eas-cli deploy --prod

echo -e "${light_blue}\nBuilding application on EAS...!\n${reset}"

bun x eas-cli build --platform android --profile preview
