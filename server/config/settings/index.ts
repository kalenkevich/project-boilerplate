import isFinite from 'lodash/isFinite';
import set from 'lodash/set';
import DefaultSettings from './default';
import LocalSettings from './local';
import DevSettings from './development';
import ProdSettings from './production';


export const ENVIRONMENTS = {
  LOCAL: 'local',
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

export const getEnvSettings = (env) => {
  switch (env) {
    case ENVIRONMENTS.LOCAL:
      return LocalSettings;
    case ENVIRONMENTS.DEVELOPMENT:
      return DevSettings;
    case ENVIRONMENTS.PRODUCTION:
      return ProdSettings;
    default:
      return LocalSettings;
  }
};

export const getParseValue = val => {
  if (isFinite(+val)) {
    return +val;
  }

  if (val === 'true') {
    return true;
  }

  if (val === 'false') {
    return false;
  }

  return val;
};

export const getObjectFromProcessEnv = (processEnv) =>
  Object.keys(processEnv || {}).reduce((config, key) => {
    set(config, key, getParseValue(processEnv[key]));

    return config;
  }, {});

export const currentEnv = process.env.ENVIRONMENT;

export const currentProcessEnv = process.env;

const settings : any =  {
  ...DefaultSettings,
  ...getEnvSettings(currentEnv),
  ...getObjectFromProcessEnv(currentProcessEnv),
};

export default settings;
