# ensure backup directory
mkdir -p ${HUMBLE_DATA}
mkdir -p ${HUMBLE_BACKUP}

# ensure parameters
CONN_STR=${PG_STRING/@localhost:/@$HUMBLE_IP:}
ABS_PATH=$(cd "$(dirname "$2")"; pwd)/$(basename "$2")

echo "> Restore from local backup"
echo ${ABS_PATH}
echo ""

docker run --rm \
    -v ${ABS_PATH}:/dump.sql \
    postgres psql --dbname=${CONN_STR} -f /dump.sql
