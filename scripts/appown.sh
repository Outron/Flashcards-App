groupadd -g 1234 appown
useradd -u 1234 -g 1234 -d /app -s /bin/bash -c "App Owner" appown
chown -R appown:appown /app