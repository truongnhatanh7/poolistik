export interface NodeMailerOptions {
  host?: string;
  service?: string;
  transport: {
    service?: string;
    auth: {
      type: string;
      user?: string;
      clientId?: string;
      clientSecret?: string;
      refresh_token?: string;
      accessToken?: string;
    };
  };
}
