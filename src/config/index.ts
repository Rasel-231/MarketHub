import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    api_secret: process.env.API_SECRET,
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    salt_round: process.env.SALT_ROUND,
    jwt: {
        jwt_secret: process.env.JWT_SECRET as string,
        jwt_expires_in: process.env.JWT_EXPIRES_IN as string,
        jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
    }
}