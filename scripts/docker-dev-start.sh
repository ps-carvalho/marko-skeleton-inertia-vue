#!/usr/bin/env sh
set -eu

composer install --no-interaction
npm ci

exec composer dev
