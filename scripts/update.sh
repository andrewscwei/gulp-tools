#!/bin/bash

set -e

ncu -a
npm -f version patch -m "Update packages"
