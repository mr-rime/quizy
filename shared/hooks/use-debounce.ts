/* eslint-disable react-hooks/refs */
import { debounce } from "@/lib/debounce";
import { useMemo, useEffect, useRef } from "react";

export function useDebounce<F extends (...args: never[]) => void>(
    callback: F,
    wait = 300
): (...args: Parameters<F>) => void {
    const callbackRef = useRef<F>(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const debouncedCallback = useMemo(() => {
        const func = (...args: Parameters<F>) => {
            callbackRef.current(...args);
        };

        return debounce(func as (...args: never[]) => never, wait);
    }, [wait]);

    return debouncedCallback;
}
