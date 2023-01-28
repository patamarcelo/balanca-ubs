import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/pt-br";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState, useEffect, useLayoutEffect } from "react";
import { TRUCK, TRUCK_OBS } from "../../../store/trucks/reducer.initials";
import { borderRadius } from "@mui/system";
import { hanlderHelperText } from "../../../utils/formHelper";

import { useSelector } from "react-redux";
import { selectUnidadeOpUser } from "../../../store/user/user.selector";
import classes from "./modal-form.module.css";

import useMediaQuery from "@mui/material/useMediaQuery";

import SheetFields from "./sheet-form-fields";

const ModalFormFields = (props) => {
	const { handleChangeTruck, truckValues, handleBlurTruck, setTruckValues } =
		props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// const [value, setValue] = useState(new Date());
	const unidadeOpUser = useSelector(selectUnidadeOpUser);
	const isNonMobile = useMediaQuery("(min-width: 900px)");

	useEffect(() => {
		if (
			truckValues.tipo === "carregando" &&
			truckValues.origem.length === 0
		) {
			setTruckValues({
				...truckValues,
				origem: unidadeOpUser?.toUpperCase(),
				data: new Date()
			});
		} else if (
			truckValues.tipo === "descarregando" &&
			truckValues.destino.length === 0
		) {
			setTruckValues({
				...truckValues,
				destino: unidadeOpUser?.toUpperCase(),
				data: new Date()
			});
		} else {
			setTruckValues({ ...truckValues, data: new Date() });
		}
	}, []);

	useLayoutEffect(() => {
		if (truckValues["pesoBruto"] > 0) {
			TRUCK[0].disabled = true;
		} else {
			TRUCK[0].disabled = false;
		}
	}, []);

	useLayoutEffect(() => {
		if (truckValues["tara"] > 0) {
			TRUCK[2].disabled = true;
		} else {
			TRUCK[2].disabled = false;
		}
	}, []);

	return (
		<form>
			<Box
				display="grid"
				gap="10px"
				gridTemplateColumns={`repeat(${
					!isNonMobile ? "1" : "2"
				}, minmax(0, 1fr))`}
				sx={{
					width: "100%",
					"& .Mui-focused .MuiOutlinedInput-notchedOutline": {
						color: `${colors.blueOrigin[100]} !important`,
						borderColor: `${colors.blueOrigin[500]} !important`,
						fontWeight: "bold"
					},
					"& .MuiInputLabel-outlined": {
						color: `${colors.blueOrigin[100]} !important`
					},
					"& .MuiInputBase-formControl": {
						backgroundColor: `${colors.brown[600]} !important`
					},
					"& .MuiInputBase-formControl.Mui-focused": {
						backgroundColor: `${colors.brown[400]} !important`
					},
					// "& .red-value": {
					// 	border: "1px red solid !important",
					// 	WebkitTextFillColor: "red"
					// },
					"& .red-value input": {
						WebkitTextFillColor: "red !important"
					},
					"& .MuiFormHelperText-contained": {
						color: colors.blueOrigin[500],
						fontStyle: "italic",
						fontWeight: "bold"
					}
				}}
			>
				<LocalizationProvider
					dateAdapter={AdapterDayjs}
					adapterLocale={"pt-br"}
					sx={{
						width: "100%"
					}}
				>
					<DatePicker
						label="Data"
						onChange={(e) => handleChangeTruck(e)}
						value={truckValues["data"]}
						disabled={true}
						renderInput={(params) => <TextField {...params} />}
					/>
				</LocalizationProvider>
				{TRUCK.map((input, index) => {
					return (
						<TextField
							key={index}
							variant="outlined"
							id={input.name}
							type={input.type}
							label={
								input.disabled && truckValues[input.name]
									? ""
									: input.label
							}
							onBlur={handleBlurTruck}
							onChange={(e) => handleChangeTruck(e)}
							value={
								input.name === "liquido" &&
								truckValues[input.name] > 0
									? truckValues[input.name].toLocaleString(
											"pt-BR"
									  ) + " Kg"
									: truckValues[input.name]
							}
							name={input.name}
							helperText={hanlderHelperText(
								input.type,
								truckValues[input.name]
							)}
							InputProps={{
								readOnly: input.disabled,
								className:
									truckValues[input.name] ===
									"Valor Negativo, verificar"
										? "red-value"
										: "no-value"
							}}
							inputProps={{
								// maxLength: 13,
								step: "0",
								min: "0"
							}}
							// value={formik.values[input.name]}
							placeholder={input.placeholder}
							sx={{
								width: "100%"
							}}
							disabled={input.disabled}
							className={classes.input}
							onWheel={(e) => e.target.blur()}
						/>
					);
				})}
			</Box>
			<Typography
				variant="h4"
				color={colors.blueOrigin[400]}
				mt="20px"
				sx={{
					fontStyle: "italic"
				}}
			>
				Observações
			</Typography>
			<Box
				sx={{
					width: "100%",
					backgroundColor: colors.grey[800],
					borderRadius: "8px",
					height: "2px",
					margin: "0px 2px 20px 2px"
				}}
			/>
			<Box
				display="grid"
				gap="10px"
				mb="8px"
				gridTemplateColumns={`repeat(${
					!isNonMobile ? "1" : "2"
				}, minmax(0, 1fr))`}
				sx={{
					width: "100%",
					"& .Mui-focused .MuiOutlinedInput-notchedOutline": {
						color: `${colors.blueOrigin[100]} !important`,
						borderColor: `${colors.blueOrigin[500]} !important`,
						fontWeight: "bold"
					},
					"& .MuiInputLabel-outlined": {
						color: `${colors.blueOrigin[100]} !important`
					},
					"& .MuiInputBase-formControl": {
						backgroundColor: `${colors.brown[600]} !important`
					},
					"& .MuiInputBase-formControl.Mui-focused": {
						backgroundColor: `${colors.brown[400]} !important`
					}
				}}
			>
				{TRUCK_OBS.map((input, index) => {
					return (
						<TextField
							key={index}
							variant="outlined"
							id={input.name}
							type={input.type}
							label={input.label}
							// onBlur={formik.handleBlur}
							onChange={handleChangeTruck}
							name={input.name}
							value={truckValues[input.name]}
							placeholder={input.placeholder}
							inputProps={{
								// maxLength: 13,
								step: "0.10"
							}}
							sx={{
								width: "100%"
							}}
						/>
					);
				})}
			</Box>

			{truckValues.tipo !== "carregando" && (
				<SheetFields
					handleChangeTruck={handleChangeTruck}
					truckValues={truckValues}
				/>
			)}
			<Box
				sx={{
					width: "100%",
					backgroundColor: colors.grey[800],
					borderRadius: "8px",
					height: "2px",
					margin: "0px 2px 20px 2px"
				}}
			/>
			<Box
				display="grid"
				gap="10px"
				gridTemplateColumns="repeat(1, minmax(0, 1fr))"
				// mt="15px"
				sx={{
					width: "100%",
					"& .Mui-focused .MuiOutlinedInput-notchedOutline": {
						color: `${colors.blueOrigin[100]} !important`,
						borderColor: `${colors.blueOrigin[500]} !important`,
						fontWeight: "bold"
					},
					"& .MuiInputLabel-outlined": {
						color: `${colors.blueOrigin[100]} !important`
					},
					"& .MuiInputBase-formControl": {
						backgroundColor: `${colors.brown[600]} !important`
					},
					"& .MuiInputBase-formControl.Mui-focused": {
						backgroundColor: `${colors.brown[400]} !important`
					}
				}}
			>
				<TextField
					id="outlined-multiline-static"
					onChange={handleChangeTruck}
					value={truckValues["observacoes"]}
					placeholder="Digite as Observações do Veículo"
					name="observacoes"
					label="Oservações"
					multiline
					rows={4}
					variant="outlined"
				/>
			</Box>
		</form>
	);
};

export default ModalFormFields;
