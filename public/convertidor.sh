#!/bin/bash

# Loop through all .gif files in the current directory
for file in *.gif; do
  # Extract the file name without the extension
  base_name="${file%.gif}"

  # Convert the .gif file to .mov using the specified ffmpeg command
  ffmpeg -i "$file" -framerate 25 -c:v prores_ks -pix_fmt yuva444p10le -alpha_bits 16 -profile:v 4444 -f mov "${base_name}.mov"
done
