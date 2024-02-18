"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, vite_tsconfig_paths_1.default)()],
    test: {
        globals: true,
        include: ['test/vitest/**/*.{spec,test}.{js,ts}'],
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'html']
        }
    },
});
//# sourceMappingURL=vitest.config.js.map