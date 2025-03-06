#!/usr/bin/env bash

light_blue='\033[1;34m'
reset='\033[0m'

echo -e "${light_blue}\nBuilding web...\n${reset}"

bun run build:web

echo -e "${light_blue}\nPublishing web on EAS...\n${reset}"

bun x eas-cli deploy

echo -e "${light_blue}\nPlease enter the deployment URL:${reset}"
read url

echo -e "${light_blue}\nUpdating the environment variable...\n${reset}"

bun x eas-cli env:update --environment=development --environment=preview --variable-name=EXPO_PUBLIC_API_BASE_URL --non-interactive --scope=project --value "$url"

echo -e "${light_blue}\nBuilding application on EAS...!\n${reset}"

bun x eas-cli build --platform android --profile preview
