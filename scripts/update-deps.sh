#!/bin/bash

set -e

VERSION=$(npm version patch)
ncu -a
git add -A
git commit -m "Update packages"
git push
git tag release-$VERSION
git push --tags


