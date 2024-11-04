import path, { dirname } from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const args = process.argv && process.argv.slice(2);
const env = args && args.length > 0 ? args[0] : 'production';

let config; // Define config variable outside try-catch block

try {
    let dotenvPath
    if (!env)
        dotenvPath = path.resolve(__dirname, '.env'); // If environment is not 'development', use .env.<env>
    else
        dotenvPath = path.resolve(__dirname, `.env.${env}`);

    // Load environment variables from the specified .env file
    const result = dotenv.config({ path: dotenvPath });
    // Check if loading .env file failed
    if (result.error) {
        throw result.error;
    }
    // Export environment variables
    config = {
        ENV: env,
        API_KEY: process.env.API_KEY,
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_USER: process.env.DATABASE_USER,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        DATABASE_NAME: process.env.DATABASE_NAME,
        MONGO_URI: process.env.MONGO_URI,
        APP_MAIL_USER : process.env.APP_MAIL_USER,
        APP_MAIL_PASSWORD : process.env.APP_MAIL_PASSWORD
    };
} catch (error) {
    console.log(error);
}

export default config; // Export config inside try-catch block
