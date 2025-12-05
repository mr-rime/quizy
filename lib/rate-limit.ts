import { RateLimiterMemory } from "rate-limiter-flexible";

// Infer the options type directly from the constructor
type RateLimiterMemoryOpts = ConstructorParameters<typeof RateLimiterMemory>[0];

export function createRateLimiter(options: RateLimiterMemoryOpts) {
    return new RateLimiterMemory(options);
}
