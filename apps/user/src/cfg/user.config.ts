export const POSTGRES_DB_CONFIG = 'POSTGRES_DB_CONFIG';
export default () => ({
  [POSTGRES_DB_CONFIG]: {
    db: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_PASSWORD,
    password: process.env.POSTGRES_PASSWORD,
    uri: process.env.POSTGRES_URL,
  },
});
