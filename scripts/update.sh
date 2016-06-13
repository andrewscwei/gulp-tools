#!/bin/bash

set -e

npm version patch
ncu -a
git add package.json
git commit -m "Update packages" && git push && git push --tags
