import React from "react";

// to avoid every key stroke to trigger a search in the database
function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = React.useState(value);

	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timeoutId);
	}, [value, delay]);

	return debouncedValue;
}

export default function useSearch(data, query, ...filters) {
    const debouncedQuery = useDebounce(query, 300); // search only triggers after 300ms of inactivity

	// optimize performance with useMemo which wrap the search logic -> it only recalculates when the search query, filters, or data actually change
    return React.useMemo(() => {
        const dataArray = Array.isArray(data) ? data : [data];

        try {
            // Apply each filter function in sequence -> easy to add or remove filters as needed
            return filters.reduce(
                (acc, feature) => feature(acc, debouncedQuery),
                dataArray
            );
        } catch (error) {
            console.error("Error applying search features:", error);
            return dataArray;
        }
    }, [data, debouncedQuery, filters]);
}