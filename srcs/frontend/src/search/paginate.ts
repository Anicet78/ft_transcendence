// Pagination Filter
// calculate the starting index by using the current page number and page size
// Then, we use the JavaScript slice method to pick out only the items that belong to that specific page
// Although the query parameter is present, it isn’t used here—it’s just for keeping the hook's interface consistent.
export default function paginate(options) {
	const { page = 1, pageSize = 10 } = options;

	return (data, query) => {
		// Query is not used here; it’s only for compatibility with our hook.
		const startIndex = (page - 1) * pageSize;

		return data.slice(startIndex, startIndex + pageSize);
	};
}