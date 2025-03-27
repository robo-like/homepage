#!/bin/bash

# Define repository details
REPO_OWNER="robo-like"
REPO_NAME="new-homepage"

# Fetch the latest release JSON from GitHub API
RELEASES_JSON=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/latest")

# Extract the list of assets
ASSETS=$(echo "$RELEASES_JSON" | grep "browser_download_url" | cut -d '"' -f 4)

# Check if any assets were found
if [[ -z "$ASSETS" ]]; then
    echo "No assets found in the latest release."
else
    echo "Available assets in the latest release:"
    echo "$ASSETS"
fi