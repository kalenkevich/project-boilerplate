const { Client } = require('pg');

const connect = async () => {
  const client = new Client(process.env.DATABASE_URL);

  await client.connect();
};

connect().then(() => {
  process.exit(0);
}).catch((error) => {
  console.warn(new Error(error));
  process.exit(1);
});
