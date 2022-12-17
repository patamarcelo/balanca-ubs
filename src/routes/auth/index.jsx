import { Box, TextField, Typography, useTheme } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik, getIn } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import { authUser } from "../../utils/firebase/firebase";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setIsAuthUser, setUser } from "../../store/user/user.action";

import './index.css'

import PasswordReset from './password-reset'


// import {
// 	createNotification,
// 	TYPES_NOTIFICATION
// } from "../../utils/notifications/notififications.utils";


import toast from 'react-hot-toast';

import { useState } from 'react'

import './index.css'


const initialValues = {
	username: "",
	password: ""
};

const FIELDS = [
	{ label: "E-mail", name: "username", type: "text" },
	{ label: "Senha", name: "password", type: "password" }
];

const Auth = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const navitgate = useNavigate();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false)

	const notifySuccess = () => toast.success('Login efetuado com sucesso!!');
	const notifyError = (error) => {
		console.log(error)
		toast.error(`Erro: ${error}` );
	}


	const isNonMobile = useMediaQuery("(min-width: 700px)");

	const handleFormSubmit = async values => {
		setIsLoading(true)
		try {
			const email = values.username;
			const password = values.password;
			const user = await authUser(email, password);
			

			if (user) {
				dispatch(setIsAuthUser(true));
				dispatch(setUser(user.user));
				notifySuccess()
				navitgate("/");
			}
		} catch (e) {
			console.log("Error adding user: ", e);
			notifyError(e)
		}
		finally {
			setIsLoading(false)
		}
	};

	const userSchema = yup.object().shape({
		username: yup.string().email("Email Inválido").required("Obrigatório"),
		password: yup.string().min(5, "Muito Curto").required("Obrigatório")
	});

	return (
		<Box
			sx={{
				height: "100%",
				width: "100%",
			}}
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			<Box
				sx={{
					backgroundColor: colors.pink[700],
					margin: "20px 20px",
					padding: "50px 20px",
					width: isNonMobile ? "80%" : "100%",
					maxWidth: isNonMobile ? "50%" : "100%",
					minHeight: "40vh",
					borderRadius: " 8px",
					boxShadow: 'inset 0 0 7px black'
				}}
			>
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					mb="50px"
				>
					{/* <Header title="Pitaya Pay" /> */}
					<Typography
						variant="h2"
						color={colors.pink[100]}
						fontWeight="bold"
						sx={{
							fontStyle: "italic"
						}}
						className="title-app"
					>
						Pitaya Pay
					</Typography>
				</Box>
				<Formik
					// onSubmit={handleFormSubmit}
					onSubmit={async (values, actions) => {
						console.log(process.env.NODE_ENV !== "production" ? actions : '');
						await handleFormSubmit(values);
						actions.setSubmitting(false);
						// actions.resetForm({
						// 	values: {
						// 		username: "",
						// 		password: ""
						// 	}
						// });
					}}
					initialValues={initialValues}
					validationSchema={userSchema}
				>
					{({
						values,
						errors,
						touched,
						handleBlur,
						handleChange,
						handleSubmit,
						handleReset,
						setFieldValue,
						isValid
					}) =>
						<form onSubmit={handleSubmit}>
							<Box
								display="grid"
								justifyContent="center"
								gap="30px"
								width="90%"
								gridTemplateColumns="repeat(1, minmax(0, 1fr))"
								sx={{
									"& > div": {
										gridColumn: isNonMobile
											? undefined
											: "span 4"
									},
									"& .MuiFormHelperText-root": {
										color: "red !important",
										fontSize: "12px"
									},
									"& input:-webkit-autofill": {
										// boxShadow: `initial`,
										// boxShadow: `none !important`,
									},
                                    "& .MuiFilledInput-input": {
                                        // boxShadow: "0 0 0 100px black inset !important"
                                        boxShadow: `0 0 0 100px ${colors.pink[900]} inset !important`,
                                    },
									"& .MuiFormLabel-root.Mui-focused": {
										color: 'white !important'
									},
									margin: " 0 auto"
								}}
							>
								{FIELDS.map((value, index) => {
									return (
										<TextField
											key={index}
											fullWidth
											variant="filled"
											type={value.type}
											label={value.label}
											onBlur={e => {
												handleBlur(e)
												if(e.target.name === 'username'){
													setFieldValue('username', e.target.value.toLowerCase().trim())
												}
											}}
											onChange={e => {
												handleChange(e)
												if(e.target.name === 'username'){
													setFieldValue('username', e.target.value.toLowerCase().trim())
												}
											}}
											value={values.name}
											name={value.name}
											errors={
												getIn(!!touched, value.name) &&
												getIn(!!errors, value.name)
											}
											helperText={
												getIn(touched, value.name) &&
												getIn(errors, value.name)
											}
										/>
									);
								})}

								<Box
									display="flex"
									justifyContent="center"
									alignItems="center"
									flexDirection="column"
									sx={{
										width: "100%"
									}}
								>
									<LoadingButton
									loading={isLoading ? true : false}
										type="submit"
										sx={{
											backgroundColor: colors.greenAccent[600],
											width: "100%",
											borderRadius: "60px"
										}}
										variant="contained"
										onClick={handleFormSubmit}
										disabled={!isValid}
									>
										Entrar
									</LoadingButton>
								<PasswordReset />
								</Box>
							</Box>
						</form>}
				</Formik>
			</Box>
		</Box>
	);
};

export default Auth;
