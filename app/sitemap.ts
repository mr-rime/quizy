import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://quizy-eg.vercel.app";

    const staticRoutes: MetadataRoute.Sitemap = [
        "",
        "/discover",
        "/latest",
        "/library",
        "/practice",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Dynamic pattern placeholders
    // Google will NOT crawl them deeply, but it knows the structure.
    const dynamicRoutes: MetadataRoute.Sitemap = [
        "/discover/",
        "/practice/",
        "/library/",
        "/share/",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
    }));

    return [...staticRoutes, ...dynamicRoutes];
}
