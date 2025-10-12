export const JWT_SECRET = process.env.JWT_SECRET!;
export const ACCESS_TOKEN_EXPIRATION_SECONDS = 60 * 15; // 15 минут
export const REFRESH_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;

// имена cookie
export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';
