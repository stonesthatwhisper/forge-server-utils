"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./authentication"), exports);
__exportStar(require("./data-management"), exports);
__exportStar(require("./model-derivative"), exports);
__exportStar(require("./bim360"), exports);
__exportStar(require("./design-automation"), exports);
__exportStar(require("./webhooks"), exports);
__exportStar(require("./reality-capture"), exports);
var common_1 = require("./common");
Object.defineProperty(exports, "ForgeClient", { enumerable: true, get: function () { return common_1.ForgeClient; } });
