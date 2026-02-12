// scans an object to gather all its keys—even those nested within arrays or sub-objects
// If you don't provide specific fields for searching, this function ensures that every potential field is considered
function getAllKeys(item, prefix = "") {
	if (!item || typeof item !== "object") {
		return [];
	}

	const fields = [];

	for (const key of Object.keys(item)) {
		const value = item[key];
		const fieldPath = prefix ? `${prefix}.${key}` : key;

		if (Array.isArray(value)) {
			value.forEach((arrayItem, index) => {
				if (
					arrayItem &&
					typeof arrayItem === "object" &&
					!(arrayItem instanceof Date)
				) {
					fields.push(...getAllKeys(arrayItem, `${fieldPath}[${index}]`));
				} else {
					fields.push(`${fieldPath}[${index}]`);
				}
			});
		} else if (value instanceof Date) {
			fields.push(fieldPath);
		} else if (value && typeof value === "object") {
			fields.push(...getAllKeys(value, fieldPath));
		} else {
			fields.push(fieldPath);
		}
	}

	return fields;
}

// Retrieve field values
// extracts the value of a given field from an object using a path string (like "user.name" or "items[0].title")
// splits the path into individual keys and then traverses the object step by step to find the correct value

function getFieldValue(item, field) {
	const keys = field.split(/[\.\[\]]/).filter(Boolean);
	let value = item;

	for (const key of keys) {
		if (value == null) {
			return null;
		}
		value = value[key];
	}

	return value;
}

// Converting values to strings
// ensure all data is in string format
// turns dates into ISO strings and booleans into "true" or "false", ensuring a uniform format for our search filter
function convertToString(value) {
	if (value instanceof Date) {
		return value.toISOString();
	}

	if (typeof value === "boolean") {
		return value ? "true" : "false";
	}

	return String(value);
}



export default function search(options) {
	const { fields, matchType } = options;

	return (data, query) => {
		const trimmedQuery = String(query).trim().toLowerCase(); // convert to case-insensitive string and removes extra spaces

		if (!trimmedQuery) return data;

		return data.filter((item) => {
			const fieldsArray = fields  // determine fields to search
				? Array.isArray(fields)
					? fields
					: [fields]
				: getAllKeys(item); // If specific fields aren’t provided, it extracts all keys, including nested ones

			return fieldsArray.some((field) => { // Filtering the data
				const fieldValue = getFieldValue(item, field);
				if (fieldValue == null) return false;

				const stringValue = convertToString(fieldValue).toLowerCase();

				switch (matchType) {
					case "exact":
						return stringValue === trimmedQuery;
					case "startsWith":
						return stringValue.startsWith(trimmedQuery);
					case "endsWith":
						return stringValue.endsWith(trimmedQuery);
					case "contains":
						return stringValue.includes(trimmedQuery);
					default:
						throw new Error(`Unsupported match type: ${matchType}`);
				}
			});
		});
	};
}