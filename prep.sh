#!/bin/sh

name=$(basename "$TRAVIS_REPO_SLUG")
[ -z "$name" ] && name=StressBlaster
cfg_ver=$(grep '<widget ' config.xml | sed -e 's/^.*version="//' -e 's/".*$//')
#echo "Building version: $cfg_ver"

validate() {
  echo 'Config.xml version:' $cfg_ver
  [ -z "$TRAVIS_TAG" ] && return 0
  echo 'TRAVIS_TAG: ' $TRAVIS_TAG
  if [ x"$TRAVIS_TAG" != x"$cfg_ver" ] ; then
    echo "config.xml and tag names do not match"
    exit 1
  fi
}

package() {
  local apk="platforms/android/build/outputs/apk/android-release.apk"
  if [ ! -f "$apk" ] ; then
    echo "Missing APK release: $apk"
    exit 1
  fi
  ls -sh "$apk"
  cp -av "$apk" "$name".apk
  # Get release notes...
  (
    version=${TRAVIS_TANG}
    [ -z "$version" ] && version=$(git describe)
    if [ -n "$version" ] ; then
      echo '# RELEASE NOTES FOR' $version
    else
      echo '# RELEASE NOTES'
    fi
    echo ''
    sed -n -e '/BEGIN RELEASE NOTES/,/END RELEASE NOTES/p' README.md 
  ) | tee RELEASE_NOTES.md
  
}

version() {
  echo $cfg_ver
}



for op in "$@"
do
  $op || exit $?
done
