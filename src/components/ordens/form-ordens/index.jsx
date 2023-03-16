import { Box, Button, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

import { tokens } from "../../../theme";

import { ordemFields } from "../../../store/ordems/ordems.initials";

import { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { selectUnidadeOpUser } from "../../../store/user/user.selector";

const initialOrdemValues = {
	origem: "",
	destino: "",
	placaTrator: "",
	placaVagao1: "",
	placaVagao2: "",
	motorista: "",
	cpf: "",
	empresa: "",
	cpfcnpj: "",
	veiculo: "",
	mercadoria: "",
	observacao: ""
};

// const phoneRegExp =
// 	/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const userSchema = yup.object().shape({
	origem: yup
		.string()
		.min(2, "Too Short")
		.max(50, "Too Long")
		.required("required")
	// lastName: yup
	// 	.string()
	// 	.min(2, "Too Short")
	// 	.max(50, "Too Long")
	// 	.required("required"),
	// email: yup.string().email("Invalid Email").required("required"),
	// contact: yup
	// 	.string()
	// 	.matches(phoneRegExp, "Phone number is not vaid")
	// 	.required("required"),
	// address1: yup
	// 	.string()
	// 	.min(2, "Too Short")
	// 	.max(120, "Too Long")
	// 	.required("required")
	// address2: yup
	// 	.string()
	// 	.min(2, "Too Short")
	// 	.max(120, "Too Long")
	// 	.required("required")
});

const FormOrdens = (props) => {
	const { setIsOpen } = props;

	const isNonMobile = useMediaQuery("(min-width: 600px)");
	const navigate = useNavigate();

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [formValues, setFormValues] = useState([]);
	const unidadeOpUser = useSelector(selectUnidadeOpUser);

	const handleFormSubmit = async (values) => {
		console.log("formSubmit", formValues);
		console.log('Values', values)
	};

	const handlerChange = (event) => {
		setFormValues({
			...formValues,
			[event.target.name]: event.target.value
		});
		console.log("formValues", formValues);
	};

	useEffect(() => {
		setFormValues({ ...initialOrdemValues, origem: unidadeOpUser });
	}, []);

	useEffect(() => {
		console.log(formValues);
	}, [formValues]);

	return (
		<Box
			sx={{
				marginTop: "20px"
			}}
		>
			<Box
				width="100%"
				sx={{
					backgroundColor: colors.blueOrigin[700],
					boxShadow: `rgba(255, 255, 255, 0.3) 2px 2px 4px 0px inset, rgba(255, 255, 255, 0.3) -1px -1px 3px 1px inset;`,
					borderRadius: "8px",
					overflow: "auto",
					height: "100%",
					padding: "20px",
					maxHeight: !isNonMobile ? "70vh" : "70vh"
					// border: `0.1px solid ${colors.primary[100]}`
				}}
			>
				<Formik
					// onSubmit={handleFormSubmit}
					onSubmit={(values, actions) => {
						console.log("submit", values);
						handleFormSubmit(values);
						actions.setSubmitting(false);
						actions.resetForm({
							values: initialOrdemValues
						});
					}}
					initialValues={initialOrdemValues}
					validationSchema={userSchema}
					// validator={() => ({})}
				>
					{({
						values,
						errors,
						touched,
						handleBlur,
						handleChange,
						handleSubmit,
						handleReset
					}) => (
						<form onSubmit={handleSubmit}>
							<Box
								display="grid"
								gap="30px"
								gridTemplateColumns="repeat(6, minmax(0, 1fr))"
								sx={{
									"& > div": {
										gridColumn: isNonMobile
											? undefined
											: "span 6"
									},
									"& .MuiFormHelperText-contained": {
										color: "red"
									}
								}}
							>
								{ordemFields.map((data, i) => {
									return (
										<TextField
											key={i}
											fullWidth
											variant="outlined"
											type={data.type}
											label={data.label}
											onBlur={handleBlur}
											onChange={handlerChange}
											rows={data.rows}
											multiline={
												data.rows > 0 ? true : false
											}
											value={formValues[data.name]}
											name={data.name}
											errors={
												!!touched[
													formValues[data.name]
												] &&
												!!errors[formValues[data.name]]
											}
											helperText={
												touched[
													initialOrdemValues[
														data.name
													]
												] &&
												errors[
													initialOrdemValues[
														data.name
													]
												]
											}
											sx={{
												gridColumn: `span ${data.col}`
											}}
										/>
									);
								})}
								{/* <TextField
								fullWidth
								variant="filled"
								type="text"
								label="First Name"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.firstName}
								name="firstName"
								errors={
									!!touched.firstName && !!errors.firstName
								}
								helperText={
									touched.firstName && errors.firstName
								}
								sx={{
									gridColumn: "span 2"
								}}
							/>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Last Name"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.lastName}
								name="lastName"
								errors={!!touched.lastName && !!errors.lastName}
								helperText={touched.lastName && errors.lastName}
								sx={{
									gridColumn: "span 2"
								}}
							/>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="E-mail"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.email}
								name="email"
								errors={!!touched.email && !!errors.email}
								helperText={touched.email && errors.email}
								sx={{
									gridColumn: "span 4"
								}}
							/>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Contact Number"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.contact}
								name="contact"
								errors={!!touched.contact && !!errors.contact}
								helperText={touched.contact && errors.contact}
								sx={{
									gridColumn: "span 4"
								}}
							/>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Address 1"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.address1}
								name="address1"
								errors={!!touched.address1 && !!errors.address1}
								helperText={touched.address1 && errors.address1}
								sx={{
									gridColumn: "span 4"
								}}
							/>
							<TextField
								fullWidth
								variant="filled"
								type="text"
								label="Address 2"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.address2}
								name="address2"
								errors={!!touched.address2 && !!errors.address2}
								helperText={touched.address2 && errors.address2}
								sx={{
									gridColumn: "span 4"
								}}
							/> */}
							</Box>
							<Box display="flex" justifyContent="end" mt="20px">
								<Button
									type="reset"
									onClick={() => {
										handleReset();
										setIsOpen(false);
									}}
									color="error"
									variant="contained"
									sx={{ mr: "15px" }}
								>
									Cancelar
								</Button>
								<Button
									type="reset"
									onClick={() =>
										setFormValues(initialOrdemValues)
									}
									color="warning"
									variant="contained"
									sx={{ mr: "15px" }}
								>
									Resetar
								</Button>
								<Button
									type="submit"
									color="secondary"
									variant="contained"
									onClick={() => handleSubmit}
								>
									Salvar Ordem
								</Button>
							</Box>
						</form>
					)}
				</Formik>
			</Box>
		</Box>
	);
};

export default FormOrdens;
