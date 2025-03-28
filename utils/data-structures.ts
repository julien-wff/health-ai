/**
 * Adds a value to a map with an array as value. Creates a new array if the key does not exist.
 * @param map Map to add the value to
 * @param key Map key
 * @param value Value to add
 * @return `true` if a new array was created, `false` if the value was added to an existing array
 */
export function addToMapArray<K, V>(map: Map<K, V[]>, key: K, value: V) {
    if (!map.has(key)) {
        map.set(key, [ value ]);
        return true;
    }
    map.get(key)?.push(value);
    return false;
}
