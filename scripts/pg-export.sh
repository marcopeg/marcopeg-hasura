# ensure backup directory
mkdir -p ${HUMBLE_DATA}
mkdir -p ${HUMBLE_BACKUP}

# ensure parameters
CONN_STR=${PG_STRING/@localhost:/@$HUMBLE_IP:}
ABS_PATH=${HUMBLE_BACKUP}/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

echo "> Run backup to local directory"
echo ${ABS_PATH}
echo ""

mkdir -p ${HUMBLE_DATA}
mkdir -p ${HUMBLE_BACKUP}
docker run --rm postgres pg_dump --dbname=${CONN_STR} > ${ABS_PATH}
