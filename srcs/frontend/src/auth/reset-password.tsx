import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './register.css'
import './login.css'

import { useMutation } from "@tanstack/react-query";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import type { GetBody } from "../types/GetType";
import api from "../serverApi";
import toast from "../Notifications";
import InputPassword from "../components/InputPassword";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "@allxsmith/bestax-bulma";

type ResetType = GetBody<"/auth/reset-password", "post">;

// Regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Yup validation schema
const schema = yup.object().shape({
	password: yup
		.string()
		.matches(passwordRegex, "Minimum 8 characters, uppercase, lowercase, number & special")
		.required("Password is required"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords must match")
		.required("Confirm password")
});

interface FormValues {
	password: string;
	confirmPassword: string;
}

function ResetPassword() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	// if (!token) {
	// 	toast({ title: "No token found", message: "Url doesn't contain any token", type: "is-danger" });
	// 	navigate("/login");
	// 	return ;
	// }

	const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
		resolver: yupResolver(schema),
	});

	const password = watch("password");
	const confirmPassword = watch("confirmPassword");

	const mutation = useMutation({
		mutationFn: (data: ResetType ) => api.post("/auth/reset-password", data),
		onSuccess: () => {
			toast({ title: "Password reset", message: "Your password has been reset", type: "is-success" })
			navigate("/login");
		},
		onError: (error: Error) => {
			toast({ title: `An error occurred`, message: error.message, type: "is-warning" })
		}
	});

	const onSubmit = (data: FormValues) => {
		if (!password) {
			toast({ title: "Missing password", message: "Please insert a valid password", type: "is-warning" });
			return ;
		}

		mutation.mutate({ token, newPassword: data.password });
	};

	return (
		<div className='resetpwd-box'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<h2>Enter your new password</h2>
				<div className="form-fields">
					<InputPassword placeholder="New password" register={register("password")} error={errors.password} watchValue={password} />
					<InputPassword placeholder="Confirm password" register={register("confirmPassword")} error={errors.confirmPassword} watchValue={confirmPassword} />
				</div>
				<div className='bottom'>
					<Button type="submit" color="primary" size='large' className="submit-wrapper">{mutation.isPending ? 'Reseting...' : 'Reset password'}</Button>
				</div>
			</form>
			<NavLink to="/" className="button is-primary is-medium is-outlined">Back to home</NavLink>
		</div>
	)
}

export default ResetPassword
