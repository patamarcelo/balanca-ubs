import { Box, Button, TextField, Typography, useTheme } from "@mui/material";

import { useFormik } from "formik";

import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

import { tokens } from "../../../theme";

import {
	ordemFields,
	ordemFieldsPessoa,
	ordemFieldsObs,
	veiculosPesos,
	produtosCadastro
} from "../../../store/ordems/ordems.initials";

import classes from "./form-style.module.css";

import toast from "react-hot-toast";

import InputLabel from "@mui/material/InputLabel";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

import { useSelector } from "react-redux";
import {
	selectCurrentUser,
	selectUnidadeOpUser
} from "../../../store/user/user.selector";

import { addOrdemCarrega } from "../../../utils/firebase/firebase.datatable.ordems";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// const phoneRegExp =
// 	/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const MySwal = withReactContent(Swal);

const userSchema = yup.object().shape({
	origem: yup
		.string()
		.min(2, "Too Short")
		.max(50, "Too Long")
		.required("Obrigatório"),
	destino: yup
		.string()
		.min(2, "Too Short")
		.max(50, "Too Long")
		.required("Obrigatório"),
	mercadoria: yup
		.string()
		.oneOf(["Arroz", "Feijão", "Soja"], "não existe")
		.required("Escolha uma opção"),
	veiculo: yup.string().required("Escolha uma opção"),
	motorista: yup.string().required("Obrigatório"),
	placaTrator: yup.string().required("Obrigatório")
	// email: yup.string().email("Invalid Email").required("required"),
	// contact: yup
	// 	.string()
	// 	.matches(phoneRegExp, "Phone number is not vaid")
	// 	.required("required"),
});

const FormOrdens = (props) => {
	const { setIsOpen } = props;

	const isNonMobile = useMediaQuery("(min-width: 600px)");

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const unidadeOpUser = useSelector(selectUnidadeOpUser);

	const user = useSelector(selectCurrentUser);

	const handlerSubmitForm = async (values) => {
		const newOrder = await addOrdemCarrega(
			values.origem,
			values.destino,
			values.placaTrator,
			values.placaVagao1,
			values.placaVagao2,
			values.motorista,
			values.cpf,
			values.empresa,
			values.cpfcnpj,
			values.veiculo,
			values.mercadoria,
			values.observacao,
			user.email,
			unidadeOpUser
		);
		if (newOrder) {
			setIsOpen(false);
			MySwal.fire({
				icon: "success",
				title: "Feito",
				text: `Ordem Cadastrada com successo!!`,
				timer: 2000
				// footer: 'Caso o cliente não receba o comprovante, falar com o financeiro@pitayajoias.com.br',
				// confirmButtonText: 'Finalizar'
			}).then((result) => {
				if (result.isConfirmed) {
				}
			});
		}
	};

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
		onSubmit: async (values, { resetForm }) => {
			await handlerSubmitForm(values);
			resetForm();
		}
	});

	// console.log(formik.errors);

	const handlerResetForm = () => {
		toast.success(`Formulário Restado`, {
			position: "top-center"
		});
	};

	return (
		<Box
			sx={{
				marginTop: "20px",
				marginBottom: "20px",
				width: "100%"
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
					padding: "20px"
					// maxHeight: !isNonMobile ? "70vh" : "70vh"
				}}
			>
				<form
					onSubmit={formik.handleSubmit}
					className={classes["form-class"]}
					// style={{ paddingTop: "10px" }}
				>
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
							},
							"& .MuiInputLabel-outlined.Mui-focused": {
								color: `white !important`,
								borderColor: `white !important`
							},
							"& .MuiOutlinedInput-notchedOutline.Mui-focused": {
								borderColor: `white !important`
							}
						}}
					>
						<Box
							mb={-2}
							sx={{
								gridColumn: "span 6"
							}}
						>
							<Typography
								variant="h5"
								color={colors.greenAccent[300]}
							>
								Rota
							</Typography>
						</Box>
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
										formik.errors[data.name] &&
										formik.touched[data.name]
											? formik.errors[data.name]
											: ""
									}
									sx={{
										gridColumn: `span ${data.col}`
									}}
								/>
							);
						})}
						<Box
							mb={-2}
							sx={{
								gridColumn: "span 6"
							}}
						>
							<Typography
								variant="h5"
								color={colors.greenAccent[300]}
							>
								Dados Motorista / Veículo
							</Typography>
						</Box>
						{ordemFieldsPessoa.map((data, i) => {
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
										formik.errors[data.name] &&
										formik.touched[data.name]
											? formik.errors[data.name]
											: ""
									}
									sx={{
										gridColumn: `span ${data.col}`
									}}
								/>
							);
						})}
						<Box
							mb={-2}
							sx={{
								gridColumn: "span 6"
							}}
						>
							<Typography
								variant="h5"
								color={colors.greenAccent[300]}
							>
								Dados da Carga
							</Typography>
						</Box>
						<FormControl
							sx={{ gridColumn: "span 3" }}
							className={classes["observacao-style"]}
						>
							<InputLabel id="veiculo-select-small">
								Veículo
							</InputLabel>
							<Select
								labelId="veiculo-select-small"
								id="veiculo"
								name="veiculo"
								value={formik.values.veiculo}
								label="Veículo"
								onChange={formik.handleChange}
							>
								{veiculosPesos.map((iterData, i) => {
									return (
										<MenuItem value={iterData.peso} key={i}>
											{iterData.tipo}
										</MenuItem>
									);
								})}
							</Select>
							{formik.errors.veiculo &&
								formik.touched.veiculo && (
									<FormHelperText
										className={
											classes.helperTextFormatError
										}
									>
										{formik.errors["veiculo"]}
									</FormHelperText>
								)}
							{formik.values.veiculo && (
								<FormHelperText
									className={classes.helperTextFormat}
								>
									{veiculosPesos
										.filter(
											(data) =>
												data.peso ===
												formik.values.veiculo
										)[0]
										.peso.toLocaleString("en")
										.replace(",", ".") + " Kg"}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl
							sx={{ gridColumn: "span 3" }}
							className={classes["observacao-style"]}
						>
							<InputLabel id="mercadoria-select-small">
								Mercadoria
							</InputLabel>
							<Select
								labelId="mercadoria-select-small"
								id="mercadoria"
								name="mercadoria"
								value={formik.values.mercadoria}
								label="Mercadoria"
								onChange={formik.handleChange}
							>
								{produtosCadastro.map((iterData, i) => {
									return (
										<MenuItem
											value={iterData.produto}
											key={i}
										>
											{iterData.produto}
										</MenuItem>
									);
								})}
							</Select>
							{formik.errors.mercadoria &&
								formik.touched.mercadoria && (
									<FormHelperText
										className={
											classes.helperTextFormatError
										}
									>
										{formik.errors["mercadoria"]}
									</FormHelperText>
								)}
						</FormControl>

						<Box
							mb={-2}
							sx={{
								gridColumn: "span 6"
							}}
						>
							<Typography
								variant="h5"
								color={colors.greenAccent[300]}
							>
								Observações
							</Typography>
						</Box>
						{ordemFieldsObs.map((data, i) => {
							return (
								<TextField
									className={classes["observacao-style"]}
									id={data.name}
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
