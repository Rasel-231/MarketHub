import { Server } from 'http';
import { server as httpServer } from './app';
import config from './config';
import startOrderCleanupCron from './app/modules/order/order.cron';

async function bootstrap() {
    let server: Server;

    try {
        server = httpServer.listen(config.port, () => {
            startOrderCleanupCron();
        });

        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        };

        process.on('uncaughtException', () => {
            exitHandler();
        });

        process.on('unhandledRejection', () => {
            exitHandler();
        });

    } catch (error) {
        process.exit(1);
    }
}

bootstrap();