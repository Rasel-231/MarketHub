import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    base_url: process.env.BASE_URL,
    frontend_url: process.env.FRONTEND_URL,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    api_secret: process.env.API_SECRET,
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    salt_round: process.env.SALT_ROUND,
    ai_api_key: process.env.AI_API_KEY,
    support_email: process.env.SUPPORT_EMAIL,
    app_password: process.env.APP_PASSWORD,
    redis_url: process.env.REDIS_URL,
    jwt: {
        jwt_secret: process.env.JWT_SECRET as string,
        jwt_expires_in: process.env.JWT_EXPIRES_IN as string,
        jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
    },
    payment: {
        store_id: process.env.store_id,
        store_password: process.env.store_password,
    }

}