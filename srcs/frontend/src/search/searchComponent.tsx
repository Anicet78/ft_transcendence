import paginate  from "./paginate.ts";
import search from "./search.ts";
import useSearch from "./useSearch.tsx";
import React from "react";

export default function SearchComponent() {
	// Example data array
	const data = [
		{ name: "JavaScript" },
		{ name: "Python" },
		{ name: "Java" },
		{ name: "Ruby" },
		{ name: "C++" },
		{ name: "Go" },
		{ name: "TypeScript" },
		{ name: "Swift" },
		{ name: "Kotlin" },
		{ name: "PHP" },
		{ name: "C#" },
		{ name: "Rust" },
		// Imagine more data here
	];

	const [query, setQuery] = React.useState("");
	const [page, setPage] = React.useState(1);
	const pageSize = 3; // Items per page

	// Apply both search and pagination filters with our custom hook.
	const results = useSearch(
		data,
		query,
		search({
			fields: ["name"],
			matchType: "contains", // Options: "exact", "startsWith", etc.
		}),
		paginate({ page, pageSize })
	);

	// Compute total pages based on filtered results (without pagination)
	const filteredData = search({ fields: ["name"], matchType: "contains" })(
		data,
		query
	);

	const totalPages = Math.ceil(filteredData.length / pageSize);

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h2>Search and Pagination</h2>
			<input
				type="text"
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
					setPage(1); // Reset to first page on new search
				}}
				placeholder="Search by name..."
				style={{ padding: "8px", width: "300px", marginBottom: "10px" }}
			/>
			<ul>
				{results.map((item, index) => (
					<li key={index}>{item.name}</li>
				))}
			</ul>
			<div style={{ marginTop: "10px" }}>
				<button
					onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
					disabled={page === 1}
					style={{ padding: "6px 12px", marginRight: "10px" }}
				>
					Previous
				</button>
				<span>Page {page} of {totalPages}</span>
				<button
					onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
					disabled={page >= totalPages}
					style={{ padding: "6px 12px", marginLeft: "10px" }}
				>
					Next
				</button>
			</div>
		</div>
	);
	}
