#!/bin/bash

GROUP_NAME="appown"
GROUP_ID=1234
USER_NAME="appown"
USER_ID=1234
APP_DIR="/app"


if [ "$(id -u)" -ne 0 ]; then
  echo "You must be root!" >&2
  exit 1
fi


if ! getent group "$GROUP_NAME" >/dev/null; then
  groupadd -g "$GROUP_ID" "$GROUP_NAME" || { echo "Failed to create group $GROUP_NAME."; exit 1; }
else
  echo "Group $GROUP_NAME already exists"
fi


if ! id -u "$USER_NAME" >/dev/null 2>&1; then
  useradd -u "$USER_ID" -g "$GROUP_ID" -d "$APP_DIR" -s /bin/bash -c "App Owner" "$USER_NAME" ||
  { echo "Failed to create user $USER_NAME."; exit 1; }
else
  echo "User $USER_NAME already exists"
fi


if [ -d "$APP_DIR" ]; then
  chown -R "$USER_NAME":"$GROUP_NAME" "$APP_DIR" || { echo "Failed to set permissions for the directory $APP_DIR."; exit 1; }
else
  echo "The $APP_DIR directory does not exist. Creating a directory..."
  mkdir -p "$APP_DIR" && chown -R "$USER_NAME":"$GROUP_NAME" "$APP_DIR" || { echo "Failed to create directory $APP_DIR."; exit 1; }
fi

echo "Succeed"