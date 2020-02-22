function sendSuccess() {
    curl -s -X POST https://api.telegram.org/bot942095073:AAGlkBJ6d4-IVKyvbHCzLdNDaZIanStJbJk/sendMessage -d chat_id=-362016378 -d text="$1 готов к работе"
}

function connect_to_potgres() {
  node bin/checkPostgresIsReady.js
  postgres_ready=$?
}

while : ; do
  echo waiting untill postgres is ready;
  sleep 3;
  connect_to_potgres;
  [[ $postgres_ready == 1 ]] || break;
done

sendSuccess 'Postgres'

function connect_to_redis() {
  node bin/checkRedisIsReady.js
  redis_ready=$?
}

while : ; do
  echo waiting untill redis is ready;
  sleep 3;
  connect_to_redis;
  [[ $redis_ready == 1 ]] || break;
done

sendSuccess 'Redis'

npm run migration:run;
npm run start;
