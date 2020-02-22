const path = require('path');
const express = require('express');
const axios = require('axios');

const app = express();

const sendToTelegram = (message) => {
  return axios.post('https://api.telegram.org/bot942095073:AAGlkBJ6d4-IVKyvbHCzLdNDaZIanStJbJk/sendMessage', {
    chat_id: '-362016378',
    text: message,
  });
};

app.use('/public', express.static(`${__dirname}/public`));
app.use('/', express.static(`${__dirname}/dist`));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

app.listen(process.env.PORT || 8080, () => {
  sendToTelegram('Client готов к работе!');
});
