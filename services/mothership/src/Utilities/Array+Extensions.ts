export { };

declare global {
    interface Array<T> {
        /**
         * Checks if the array does not include any of the specified items.
         * @param prohibitedItems An array of items to check against.
         * @returns A boolean indicating whether the array does not include any of the prohibited items.
         */
        doesNotInclude(prohibitedItems: T[]): boolean;
        /**
         * Removes undefined elements from the array.
         * @returns An array with undefined elements removed.
         */
        removeUndefined(): T[];
    }
}

Array.prototype.doesNotInclude = function <T>(prohibitedItems: T[]): boolean {
    for (const item of this) {
        if (prohibitedItems.includes(item)) {
            return false;
        }
    }
    return true;
};

Array.prototype.removeUndefined = function <T>(): T[] {
    return this.filter((x): x is T => typeof x !== 'undefined');
};