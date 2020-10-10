"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config = require("config");
const common_1 = require("@nestjs/common");
const serverConfig = config.get('server');
async function bootstrap() {
    const logger = new common_1.Logger("bootstrap");
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({}));
    let port = process.env.PORT || serverConfig.port;
    logger.log(`Server running in port ${port}`);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map