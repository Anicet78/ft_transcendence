import { useState } from "react";
import { Box, Button } from "@allxsmith/bestax-bulma";
import { FileInputButton, FileCard } from "@files-ui/react";
import type { ExtFile } from "@files-ui/react";
import { NavLink, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../serverApi";
import toast from "../Notifications";

const AvatarUpdate = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// --- File state ---
	const [filesReplace, setFilesReplace] = useState<ExtFile[]>([]);

	const updateFilesReplace = (newFile: ExtFile[]) => setFilesReplace(newFile);
	const removeFileReplace = (id: string) =>
		setFilesReplace(prev => prev.filter(f => f.id !== id)); // removes the previous file

	// --- Mutation ---
	const mutation = useMutation({
		mutationFn: async () => {
			if (filesReplace.length === 0) return;

			const formData = new FormData();
			formData.append('file', filesReplace[0].file);

			return api.post('/profile/avatar', formData, {
				headers: {'Content-Type': 'multipart/form-data' }
			});
		},
		onSuccess: (data) => {
			queryClient.setQueryData(['profile'], data); // update cache directly
			navigate('/profile');
			toast({title: 'Success', message: 'Avatar updated successfully!', type: 'is-success'})
		},
		onError: (err) => {
			console.error(err);
			alert('Upload failed. Please try again.');
		}
	});

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>Change Profile Avatar</h1>

			<Box m="4" p="6" className="friendbox" bgColor="grey-light" textColor="black">
				<FileInputButton
				onChange={updateFilesReplace}
				value={filesReplace}
				variant="outlined"
				label="Replace avatar"
				behaviour="replace"
				/>
				{filesReplace.map(file => (
				<FileCard
					key={file.id}
					{...file}
					onDelete={removeFileReplace}
					info
					preview
				/>
				))}
				<br />
				<Button
				mt="4"
				onClick={() => mutation.mutate()}
				disabled={filesReplace.length === 0 || mutation.isPending}
				>
				Upload
				</Button>
			</Box>
			<NavLink to="/profile" className="button is-medium">
				Back to profile
			</NavLink>
		</Box>
	);
};

export default AvatarUpdate;
