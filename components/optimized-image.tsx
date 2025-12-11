"use client";

import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import useSWR from "swr";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
    src: string;
    noOptimize?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function OptimizedImage({ src, alt, className, noOptimize = false, ...props }: OptimizedImageProps) {
    const [isLoadingImage, setIsLoadingImage] = useState(true);

    const { data } = useSWR(
        !noOptimize && src ? `/api/process-image?url=${encodeURIComponent(src)}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 86400000,
            shouldRetryOnError: false,
        }
    );

    const optimizedSrc = data?.success && data?.optimizedUrl ? data.optimizedUrl : src;

    return (
        <Image
            src={optimizedSrc}
            alt={alt}
            className={cn(
                "transition-all duration-500",
                isLoadingImage ? "scale-110 blur-xl grayscale" : "scale-100 blur-0 grayscale-0",
                className
            )}
            onLoad={() => setIsLoadingImage(false)}
            unoptimized // because of Vercel's free quota
            {...props}
        />
    );
}
