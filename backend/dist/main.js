"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const listen_module_1 = require("./modules/listen.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(listen_module_1.ListenModule);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map