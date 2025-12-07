import { RateLimiterMemory } from "rate-limiter-flexible";

type RateLimiterMemoryOpts = ConstructorParameters<typeof RateLimiterMemory>[0];

export function createRateLimiter(options: RateLimiterMemoryOpts) {
    return new RateLimiterMemory(options);
}
