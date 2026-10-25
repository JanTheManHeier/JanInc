FROM alpine:3.22

RUN apk add --no-cache mariadb-client rclone tar tzdata

COPY backup.sh /usr/local/bin/backup
RUN chmod 0755 /usr/local/bin/backup

ENTRYPOINT ["/usr/local/bin/backup"]

