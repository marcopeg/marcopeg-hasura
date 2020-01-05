# ensure backup directory
mkdir -p ${HUMBLE_DATA}
mkdir -p ${HUMBLE_BACKUP}

# ensure parameters
CONN_STR=${PG_STRING_LOCAL/@localhost:/@$HUMBLE_IP:}
ABS_PATH=$(cd "$(dirname "$2")"; pwd)/$(basename "$2")

echo "> Restore from local backup"
echo ${ABS_PATH}
echo ""

humble exec postgres pg_restore --user=$BACKUP_SQL_USER -C -d $BACKUP_SQL_DB $BACKUP_FILE_PATH

docker run --rm \
    -v ${ABS_PATH}:/dump.sql \
    postgres psql --dbname=${CONN_STR} -f /dump.sql

# docker run --rm \
#     -v ${ABS_PATH}:/dump.sql \
#     postgres pg_restore --dbname=${CONN_STR} -C /dump.sql
