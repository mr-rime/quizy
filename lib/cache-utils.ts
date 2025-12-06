
export const CACHE_REVALIDATION = {
    STATIC_CONTENT: 3600,      // 1 hour - for flashcard sets, folders, library
    USER_CONTENT: 1800,        // 30 minutes - for favorites, user-specific data
    SESSION_DATA: 300,         // 5 minutes - for sessions and current user
    USER_LOOKUP: 900,          // 15 minutes - for user email lookups
} as const;

export const CACHE_TAGS = {
    FLASHCARD_SET: "flashcard-set",
    FLASHCARD_SETS: "flashcard-sets",
    RECENT_SETS: "recent-sets",

    FOLDER: "folder",
    FOLDERS: "folders",

    FAVORITES: "favorites",
    USER: "user",
    SESSION: "session",

    LIBRARY: "library",
    LATEST: "latest",
} as const;

/**
 * Helper to generate cache key for a specific resource
 * @param tag - Base cache tag
 * @param id - Resource ID (optional)
 */
export function getCacheKey(tag: string, id?: string): string {
    return id ? `${tag}-${id}` : tag;
}

/**
 * Helper to get all cache tags that should be invalidated for a resource
 * @param resource - Resource type (e.g., 'flashcard-set', 'folder')
 */
export function getInvalidationTags(resource: keyof typeof CACHE_TAGS): string[] {
    const tags: string[] = [];

    switch (resource) {
        case "FLASHCARD_SET":
            tags.push(CACHE_TAGS.FLASHCARD_SET, CACHE_TAGS.FLASHCARD_SETS, CACHE_TAGS.RECENT_SETS);
            break;
        case "FOLDER":
            tags.push(CACHE_TAGS.FOLDER, CACHE_TAGS.FOLDERS);
            break;
        case "FAVORITES":
            tags.push(CACHE_TAGS.FAVORITES, CACHE_TAGS.FLASHCARD_SET);
            break;
        default:
            tags.push(CACHE_TAGS[resource]);
    }

    return tags;
}
