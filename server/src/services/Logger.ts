import { Service } from 'typedi';

import { sendToTelegram } from "../../utils";

@Service('Logger')
export default class Logger {
  public trace(message) {
    console.log(message);
  }

  public info(message) {
    console.log(message);
  }

  public warn(message) {
    console.log(message);
  }

  public error(message) {
    console.log(message);
  }

  public telegram(message) {
    if (process.env.ENVIRONMENT === 'production') {
      sendToTelegram(message)
    }
  }
}
