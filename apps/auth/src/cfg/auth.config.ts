export const AUTH_CONFIG = 'AUTH_CONFIG';
export default () => ({
  [AUTH_CONFIG]: {
    databae: {
      db: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_PASSWORD,
      password: process.env.POSTGRES_PASSWORD,
      uri: process.env.POSTGRES_URL,
    },
    redis: {
      kv_url: process.env.KV_URL,
      tls: true,
      ttl: 3600, // 1hour
    },
    http: {
      timeout: 5000,
      maxRedirects: 5,
    },
    mail: {
      service: process.env.GCP_MAIL_SERVICE,
      auth: {
        type: process.env.GCP_AUTH_TYPE,
        user: process.env.GCP_EMAIL_ADDR,
        clientId: process.env.GCP_OAUTH_CLIENTID,
        clientSecret: process.env.GCP_OAUTH_SECRET,
        refreshToken: process.env.GCP_REFRESH_TOKEN,
      },
    },
  },
});
