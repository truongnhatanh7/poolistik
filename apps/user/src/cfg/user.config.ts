export const USER_CONFIG = 'USER_CONFIG';
export default () => ({
  [USER_CONFIG]: {
    db: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_PASSWORD,
    password: process.env.POSTGRES_PASSWORD,
    uri: process.env.POSTGRES_URL,
  },
});
