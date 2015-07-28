#!/bin/bash

if [ "$1" != "front" ] && [ "$1" != "admin" ]; then
  echo "input argument as the app directory: 'front' or 'admin'."
  exit 1
fi

MODE="development"

PROJECT_HOME="/Users/leesangwon/Desktop/Projects/Shine"
OPTION_SETTINGS="--settings $PROJECT_HOME/conf/$MODE/settings-$1-minified.json"
OPTION_MOBILE_SERVER="--mobile-server http://localhost:3000"
APP_PATH="$PROJECT_HOME/apps/$1"


# the argument $1 is passed into the env.sh
echo "Loading Environment Variables"
source $PROJECT_HOME/conf/$MODE/env.sh


echo "Starting Meteor"
cd $APP_PATH
meteor $OPTION_SETTINGS
#meteor run android $OPTION_SETTINGS
#meteor run android-device --verbose $OPTION_MOBILE_SERVER $OPTION_SETTINGS
#meteor run ios $OPTION_SETTINGS
#meteor run ios-device $OPTION_MOBILE_SERVER $OPTION_SETTINGS