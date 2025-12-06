export const debounce = <F extends (...args: never[]) => never>(
    callback: F,
    wait: number
): ((...args: Parameters<F>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    return (...args: Parameters<F>) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            callback(...args);
        }, wait);
    };
};
