"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeDigikalaError = exports.buildDigikalaQueue = exports.normalizeDigikalaSyncStatus = void 0;
const normalizeDigikalaSyncStatus = (value) => {
    const normalized = String(value ?? "").trim().toUpperCase();
    if (normalized === "QUEUED")
        return "PENDING";
    if (["PENDING", "SYNCING", "SYNCED", "FAILED"].includes(normalized)) {
        return normalized;
    }
    return "PENDING";
};
exports.normalizeDigikalaSyncStatus = normalizeDigikalaSyncStatus;
const buildDigikalaQueue = (items, batchSize) => {
    const safeBatchSize = Math.max(1, Number(batchSize) || 25);
    if (items.length === 0)
        return [];
    const queue = [];
    for (let index = 0; index < items.length; index += safeBatchSize) {
        queue.push(items.slice(index, index + safeBatchSize));
    }
    return queue;
};
exports.buildDigikalaQueue = buildDigikalaQueue;
const shouldRedactKey = (key) => {
    const normalized = key.toLowerCase();
    return [
        "token",
        "secret",
        "privatekey",
        "private_key",
        "authorization",
        "apikey",
        "api_key",
        "password",
        "cookie",
    ].some((candidate) => normalized.includes(candidate));
};
const sanitizeDigikalaError = (input) => {
    const visit = (value) => {
        if (Array.isArray(value))
            return value.map((item) => visit(item));
        if (value && typeof value === "object") {
            return Object.fromEntries(Object.entries(value).map(([key, child]) => [
                key,
                shouldRedactKey(key) ? "[REDACTED]" : visit(child),
            ]));
        }
        return value;
    };
    return visit(input);
};
exports.sanitizeDigikalaError = sanitizeDigikalaError;
