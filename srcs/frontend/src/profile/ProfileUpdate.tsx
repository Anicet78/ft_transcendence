import type { ComponentType } from "react";
import { useParams, NavLink } from "react-router"
import AvatarUpdate from "./AvatarUpdate.tsx"
import UsernameUpdate from "./UsernameUpdate.tsx";
import regionUpdate from "./RegionUpdate.tsx";
import EmailUpdate from "./EmailUpdate.tsx";
import PasswordUpdate from "./PasswordUpdate.tsx";
import "./update.css"

type UpdateField = "avatar" | "username" | "region" | "email" | "password";

const updateComponents: Record<UpdateField, ComponentType> = {
  avatar: AvatarUpdate,
  username: UsernameUpdate,
  region: regionUpdate,
  email: EmailUpdate,
  password: PasswordUpdate
};

// type guard:
// If isUpdateField(value) returns true, value is one of the valid keys of updateComponents
// (in is a JavaScript operator that checks if a property exists in an object)
function isUpdateField(value: string): value is UpdateField {
  return value in updateComponents;
}

const ProfileUpdate = () => {
	const { field } = useParams<{ field: string }>();

	if (!field || !isUpdateField(field)) {
		return (
		<div className="update-box">
			<div className="invalid-update">Error: invalid update field</div>
			<NavLink to="/profile" className="button is-medium navlink-button">Back to profile</NavLink>
		</div>);
	}

	const Component = updateComponents[field];
	return <Component />;
}

export default ProfileUpdate
