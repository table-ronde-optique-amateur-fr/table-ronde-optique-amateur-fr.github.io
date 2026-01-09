#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TSV_FILE="$PROJECT_ROOT/src/data/speakers.tsv"
OUTPUT_DIR="$PROJECT_ROOT/public/speakers"

if [[ -z "$FRAMA_COOKIE" ]]; then
    echo "Error: FRAMA_COOKIE environment variable is required"
    echo "Usage: FRAMA_COOKIE='your_cookie_value' $0"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

tail -n +4 "$TSV_FILE" | while IFS=$'\t' read -r name email photo_url rest; do
    name="${name#\"}"
    name="${name%\"}"
    photo_url="${photo_url#\"}"
    photo_url="${photo_url%\"}"

    if [[ -z "$name" || -z "$photo_url" ]]; then
        continue
    fi

    slug=$(echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
    extension="${photo_url##*.}"
    output_file="$OUTPUT_DIR/${slug}.${extension}"

    echo "Downloading photo for $name -> $output_file"
    curl -sL --cookie "$FRAMA_COOKIE" "$photo_url" -o "$output_file"
done

echo "Done. Photos saved to $OUTPUT_DIR"
