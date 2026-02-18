// files-ui doesn't have a type package and is written in js
// so this module silences the warning of typescript
declare module '@files-ui/react' {
	import * as React from 'react';

	// Represents a file selected via FileInputButton
	export interface ExtFile {
	id: string;         // unique identifier for the file
	file: File;         // actual File object from browser
	name: string;       // file name
	size: number;       // file size in bytes
	type: string;       // MIME type, e.g., "image/png"
	valid: boolean;     // if the file passes internal validation
	[key: string]: any; // allow extra library-specific props
}	

	// Props for the FileInputButton
	export interface FileInputButtonProps {
		onChange: (files: ExtFile[]) => void;
		value: ExtFile[];
		label?: string;
		variant?: string;
		behaviour?: "add" | "replace";
	}

	// Strongly typed props for FileCard
	export interface FileCardProps extends ExtFile {
		onDelete: (id: string) => void;
		info?: boolean;
		preview?: boolean;
		className?: string;
		[key: string]: any; // allow extra props
	}
	// Export the main components
	export const FileInputButton: React.FC<FileInputButtonProps>;
	export const FileCard: React.FC<FileCardProps>;
}