import axios from "axios";

export const getFirst = (list: any[]) : any => {
  if (list.length) {
    return list[0]
  }

  return null;
};

export const sendToTelegram = (message: string) => {
  return axios.post('https://api.telegram.org/bot942095073:AAGlkBJ6d4-IVKyvbHCzLdNDaZIanStJbJk/sendMessage', {
    chat_id: '-362016378',
    text: message,
  });
}
