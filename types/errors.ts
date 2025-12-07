import { RateLimiterRes } from "rate-limiter-flexible";

export interface ApiError extends Error {
    code?: string;
    details?: unknown;
}

export interface DatabaseError extends ApiError {
    code: string;
    constraint?: string;
    detail?: string;
}

export type RateLimitError = RateLimiterRes;

export function isRateLimitError(error: unknown): error is RateLimitError {
    return (
        typeof error === "object" &&
        error !== null &&
        "msBeforeNext" in error &&
        typeof (error as RateLimitError).msBeforeNext === "number"
    );
}

export function isDatabaseError(error: unknown): error is DatabaseError {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as DatabaseError).code === "string"
    );
}

export function isApiError(error: unknown): error is ApiError {
    return error instanceof Error;
}
