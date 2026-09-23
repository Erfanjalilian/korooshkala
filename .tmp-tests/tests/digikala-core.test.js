"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const core_1 = require("../lib/digikala/core");
(0, node_test_1.default)('normalizeDigikalaSyncStatus accepts common statuses', () => {
    strict_1.default.equal((0, core_1.normalizeDigikalaSyncStatus)('pending'), 'PENDING');
    strict_1.default.equal((0, core_1.normalizeDigikalaSyncStatus)('SYNCING'), 'SYNCING');
    strict_1.default.equal((0, core_1.normalizeDigikalaSyncStatus)('failed'), 'FAILED');
});
(0, node_test_1.default)('buildDigikalaQueue batches product IDs correctly', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const queue = (0, core_1.buildDigikalaQueue)(ids, 2);
    strict_1.default.deepEqual(queue, [['a', 'b'], ['c', 'd'], ['e']]);
});
(0, node_test_1.default)('sanitizeDigikalaError removes sensitive values', () => {
    const error = (0, core_1.sanitizeDigikalaError)({
        message: 'Access token expired',
        endpoint: '/open-api/v1/auth/refresh-token',
        responseBody: {
            accessToken: 'top-secret',
            refreshToken: 'refresh-secret',
            privateKey: 'private-key',
        },
    });
    strict_1.default.equal(error.message, 'Access token expired');
    strict_1.default.ok(!error.responseBody?.accessToken);
    strict_1.default.ok(!error.responseBody?.refreshToken);
    strict_1.default.ok(!error.responseBody?.privateKey);
});
