"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBusinessId = exports.GetUser = void 0;
const common_1 = require("@nestjs/common");
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
exports.GetBusinessId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.businessId || request.user?.sub;
});
//# sourceMappingURL=get-user.decorator.js.map