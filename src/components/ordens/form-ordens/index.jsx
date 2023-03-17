import { Box, Button, TextField, useTheme } from "@mui/material";

import { useFormik } from "formik";

import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

import { tokens } from "../../../theme";

import { ordemFields } from "../../../store/ordems/ordems.initials";

import { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { selectUnidadeOpUser } from "../../../store/user/user.selector";
import toast from "react-hot-toast";

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

	const unidadeOpUser = useSelector(selectUnidadeOpUser);

	const formik = useFormik({
		initialValues: {
			origem: unidadeOpUser,
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
		},
		validationSchema: userSchema,
		onSubmit: (values, { resetForm }) => {
			console.log(values);
			resetForm();
		}
	});

	console.log(formik.errors);

	const handlerResetForm = () => {
		toast.success(`Formulário Restado`, {
			position: "top-center"
		});
	};

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
				<form onSubmit={formik.handleSubmit}>
					<Box
						display="grid"
						gap="30px"
						gridTemplateColumns="repeat(6, minmax(0, 1fr))"
						sx={{
							"& > div": {
								gridColumn: isNonMobile ? undefined : "span 6"
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
									rows={data.rows}
									multiline={data.rows > 0 ? true : false}
									onChange={formik.handleChange}
									value={formik.values[data.name]}
									name={data.name}
									helperText={
										formik.errors[data.name]
											? formik.errors[data.name]
											: ""
									}
									sx={{
										gridColumn: `span ${data.col}`
									}}
								/>
							);
						})}
					</Box>
					<Box display="flex" justifyContent="end" mt="20px">
						<Button
							type="reset"
							onClick={() => {
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
							color="warning"
							variant="contained"
							sx={{ mr: "15px" }}
							onClick={() => {
								formik.resetForm();
								handlerResetForm();
							}}
						>
							Resetar
						</Button>
						<Button
							type="submit"
							color="secondary"
							variant="contained"
						>
							Salvar Ordem
						</Button>
					</Box>
				</form>
			</Box>
		</Box>
	);
};

export default FormOrdens;
