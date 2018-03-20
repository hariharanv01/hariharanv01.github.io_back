#!/bin/bash
npm install &&
bundle install &&
bundle update &&
npm run build &&
./generate-static.sh &&
JEKYLL_ENV=production
bundle exec jekyll serve --config _config.yml --no-watch
