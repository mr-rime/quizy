"use client";

import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import useSWR from "swr";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
    src: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function OptimizedImage({ src, alt, className, ...props }: OptimizedImageProps) {
    const { data } = useSWR(
        src ? `/api/process-image?url=${encodeURIComponent(src)}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    const optimizedSrc = data?.success && data?.optimizedUrl ? data.optimizedUrl : src;

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <Image
                src={optimizedSrc}
                alt={alt}
                className={cn(
                    "transition-opacity duration-300",
                    "opacity-100 blur-0"
                )}
                {...props}
            />
        </div>
    );
}
