"use client"

import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { useDebounce } from '@/shared/hooks/use-debounce';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { OptimizedImage } from '@/components/optimized-image';

type PixabayPhoto = {
    id: number;
    url: string;
    thumbnail: string;
    small: string;
    photographer: string;
    alt: string;
};

type PixabayResponse = {
    photos: PixabayPhoto[];
    page: number;
    perPage: number;
    totalResults: number;
    nextPage: string | null;
};

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) {
        throw new Error('Failed to fetch images');
    }
    return res.json();
});

type ImageSearchModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectImage: (imageUrl: string) => void;
};

export function ImageSearchModal({ open, onOpenChange, onSelectImage }: ImageSearchModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce((query: string) => {
        setDebouncedQuery(query);
        setPage(1);
    }, 500);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    const { data, error, isLoading } = useSWR<PixabayResponse>(
        debouncedQuery.trim()
            ? `/api/pixabay/search?query=${encodeURIComponent(debouncedQuery)}&page=${page}&per_page=15`
            : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    const results = data?.photos || [];
    const totalResults = data?.totalResults || 0;
    const hasNextPage = !!data?.nextPage;

    const handleSelectImage = useCallback((imageUrl: string) => {
        onSelectImage(imageUrl);
        onOpenChange(false);
        setSearchQuery('');
        setPage(1);
    }, [onSelectImage, onOpenChange]);

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            setPage(page + 1);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Search Images</DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                        placeholder="Search for art & illustrations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-muted-foreground" size={32} />
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12 text-red-500">
                            Failed to load images. Please try again.
                        </div>
                    )}

                    {!isLoading && !error && results.length === 0 && debouncedQuery && (
                        <div className="text-center py-12 text-muted-foreground">
                            No images found. Try a different search term.
                        </div>
                    )}

                    {!isLoading && !error && results.length === 0 && !debouncedQuery && (
                        <div className="text-center py-12 text-muted-foreground">
                            Search for images to get started
                        </div>
                    )}

                    {!isLoading && !error && results.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 py-4">
                            {results.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="relative aspect-square cursor-pointer rounded-lg overflow-hidden group hover:ring-2 hover:ring-primary transition-all"
                                    onClick={() => handleSelectImage(`${photo.url}?pixabayId=${photo.id}`)}
                                >
                                    <OptimizedImage
                                        src={photo.thumbnail}
                                        alt={photo.alt}
                                        fill
                                        className="object-cover"
                                        noOptimize={true}
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <p className="text-white text-xs truncate">
                                            Photo by {photo.photographer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {results.length > 0 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Page {page} • {totalResults.toLocaleString()} results
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePreviousPage}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={!hasNextPage}
                            >
                                Next
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
