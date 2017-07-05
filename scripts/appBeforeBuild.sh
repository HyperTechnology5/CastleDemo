#!/bin/sh
#
# Run this before build
#
set -e
target=www/js

ckdep() {
  local src="$1" dst="$2"
  [ ! -f "$dst" ] && return 0
  [ "$src" -nt "$dst" ] && return 0
  return 1
}

for src in src/*
do
 
  case "$src" in
    *.ts)
      name=$(basename "$src" .ts).js
      if ckdep "$src" "$target/$name" ; then
	echo "Transpiling $src to $name"
        tsc --outFile "$target/$name" "$src"
      fi
      ;;
    *)
      name=$(basename "$src")
      ckdep "$src" "$target/$name" && cp -av "$src" "$target/$name"
      ;;
  esac
done

#Environment Variable Name	Description
#CORDOVA_VERSION	The version of the Cordova-CLI.
#CORDOVA_PLATFORMS	Comma separated list of platforms that the command applies to (e.g: android, ios).
#CORDOVA_PLUGINS	Comma separated list of plugin IDs that the command applies to (e.g: cordova-plugin-file-transfer, cordova-plugin-file).
#CORDOVA_HOOK	Path to the hook that is being executed.
#CORDOVA_CMDLINE	The exact command-line arguments passed to cordova (e.g: cordova run ios --emulate).
