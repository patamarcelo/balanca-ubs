import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import TextField from "@mui/material/TextField";
import "dayjs/locale/pt-br";
import { useEffect, useLayoutEffect, useState } from "react";
import {
	TRUCK,
	TRUCK_OBS,
	FAZENDA_ORIGEM
} from "../../../store/trucks/reducer.initials";
import { hanlderHelperText } from "../../../utils/formHelper";

import { useSelector } from "react-redux";
import {
	selectUnidadeOpUser,
	selectIsVendasUser
} from "../../../store/user/user.selector";
import classes from "./modal-form.module.css";

import useMediaQuery from "@mui/material/useMediaQuery";

import SheetFields from "./sheet-form-fields";

import formatDate from "../../../utils/format-suport/data-format";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

import dataParcelas from "../../../store/parcelas.json";

const ModalFormFields = (props) => {
	const { handleChangeTruck, truckValues, handleBlurTruck, setTruckValues } =
		props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// const [value, setValue] = useState(new Date());
	const unidadeOpUser = useSelector(selectUnidadeOpUser);
	const isVendasUser = useSelector(selectIsVendasUser);
	const isNonMobile = useMediaQuery("(min-width: 900px)");

	const origemDest = [];
	const filteredOrigemDestino = FAZENDA_ORIGEM.filter(
		(data) => data.user === unidadeOpUser
	);
	filteredOrigemDestino.map((data) => {
		origemDest.push(data.local);
		return data;
	});

	const [newOrigin, setNewOrigin] = useState([]);
	const [newDestin, setNewDestin] = useState([]);
	const [newParelas, setNewParcelas] = useState([]);

	useEffect(() => {
		if (truckValues?.fazendaOrigem) {
			const parcelasArray =
				dataParcelas?.dados[truckValues?.fazendaOrigem] || []
			const newArray = Object.entries(parcelasArray).map(([parcela, details]) => ({
				...details,
				parcela
			}));
			setNewParcelas(newArray);
		}

		if (
			truckValues?.fazendaOrigem?.length > 0 &&
			truckValues?.parcelasNovas?.length > 0 &&
			truckValues?.mercadoria?.length === 0 &&
			truckValues?.cultura?.length === 0
		) {
			const culturaSelected =
				dataParcelas["dados"][truckValues.fazendaOrigem][
					truckValues.parcelasNovas[0]
				]?.cultura;
			const variedadeSelected =
				dataParcelas["dados"][truckValues.fazendaOrigem][
					truckValues.parcelasNovas[0]
				]?.variedade;
			truckValues.mercadoria = variedadeSelected;
			truckValues.cultura = culturaSelected;
		}
	}, [truckValues]);

	useEffect(() => {
		if (isVendasUser) {
			setNewOrigin(FAZENDA_ORIGEM);
		} else {
			const newData = FAZENDA_ORIGEM.filter((data) => {
				return data.user === unidadeOpUser;
			});
			setNewOrigin(newData);
		}
	}, []);

	useEffect(() => {
		if (isVendasUser) {
			setNewDestin(FAZENDA_ORIGEM);
		} else {
			const newData = FAZENDA_ORIGEM.filter((data) => {
				return data.local.split(" ")[0] !== "Projeto";
			});
			setNewDestin(newData);
			return;
		}
	}, []);

	useEffect(() => {
		if (truckValues.liquido > 0) {
			console.log("Edit FUll");
			setTruckValues({
				...truckValues
			});
			return;
		}
		// if (truckValues.pesoBruto > 0 || truckValues.tara > 0) {
		// 	console.log("editando a carga");
		// 	setTruckValues({
		// 		...truckValues,
		// 		data: new Date(
		// 			truckValues.entrada.seconds * 1000 +
		// 				truckValues.entrada.nanoseconds / 1000000
		// 		)
		// 	});
		// 	return;
		// }
		if (
			truckValues.tipo === "carregando" &&
			truckValues.origem.length === 0
		) {
			console.log("Open Modal Carregando");
			setTruckValues({
				...truckValues,
				data: new Date()
			});
		} else if (
			truckValues.tipo === "descarregando" &&
			truckValues.destino.length === 0
		) {
			console.log("Open Modal DESCARREGANDO");
			setTruckValues({
				...truckValues,
				data: new Date()
			});
		} else {
			console.log("Open Modal Última Opção");
			setTruckValues({
				...truckValues,
				data: new Date(
					truckValues?.entrada?.seconds * 1000 +
					truckValues?.entrada?.nanoseconds / 1000000
				)
			});
		}
	}, []);

	useLayoutEffect(() => {
		if (truckValues["pesoBruto"] > 0) {
			TRUCK[3].disabled = true;
		} else {
			TRUCK[3].disabled = false;
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
				gridTemplateColumns={`repeat(${!isNonMobile ? "1" : "2"
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
				<TextField
					key="data"
					variant="outlined"
					id="data"
					type="text"
					label="Data"
					name="data"
					disabled={true}
					value={
						truckValues.liquido > 0
							? truckValues.entrada?.nanoseconds
								? formatDate(truckValues.entrada)
								: truckValues.entrada
							: truckValues["data"]?.toLocaleString("pt-BR")
					}
					sx={{
						width: "100%"
					}}
				/>
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
								min: "0",
								maxLength: input.maxlength
							}}
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
				color={colors.blueOrigin[200]}
				mt="20px"
				sx={{
					fontStyle: "italic"
				}}
			>
				Dados Produto
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
				gridTemplateColumns={`repeat(${!isNonMobile ? "1" : "2"
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
				<FormControl
					gridTemplateColumns={`repeat(${!isNonMobile ? "1" : "2"
						}, minmax(0, 1fr))`}
					// sx={{ gridColumn: "span 3" }}
					className={classes["observacao-style"]}
				>
					<InputLabel id="fazendaOrigem-select-small">
						Origem
					</InputLabel>
					<Select
						labelId="fazendaOrigem-select-small"
						id="fazendaOrigem"
						name="fazendaOrigem"
						value={truckValues["fazendaOrigem"]}
						label="Mercadoria"
						onChange={handleChangeTruck}
					>
						{newOrigin.map((iterData, i) => {
							return (
								<MenuItem value={iterData.local} key={i}>
									{iterData.local}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
				<FormControl
					gridTemplateColumns={`repeat(${!isNonMobile ? "1" : "2"
						}, minmax(0, 1fr))`}
					// sx={{ gridColumn: "span 3" }}
					className={classes["observacao-style"]}
				>
					<InputLabel id="fazendaDestino-select-small">
						Destino
					</InputLabel>
					<Select
						labelId="fazendaDestino-select-small"
						id="fazendaDestino"
						name="fazendaDestino"
						value={truckValues["fazendaDestino"]}
						label="Mercadoria"
						onChange={handleChangeTruck}
					>
						{newDestin.map((iterData, i) => {
							return (
								<MenuItem value={iterData.local} key={i}>
									{iterData.local}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>

				<FormControl
					disabled={newParelas.length < 1}
					className={classes["parcelasF"]}
				>
					<InputLabel id="parcelasNovas-select-small">
						Parcelas
					</InputLabel>
					<Select
						labelId="parcelasNovas-select-small"
						id="parcelasNovas"
						multiple
						name="parcelasNovas"
						value={
							truckValues["parcelasNovas"]
								? truckValues["parcelasNovas"]
								: []
						}
						label="Parcelas"
						onChange={handleChangeTruck}
					>
						{newParelas.map((iterData, i) => {
							return (
								<MenuItem value={iterData.parcela} key={i}>
									{iterData.parcela} - {iterData.variedade}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>

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
							helperText={input.helperText}
							inputProps={{
								// maxLength: 13,
								step: "0.10",
								min: "0"
							}}
							sx={{
								width: "100%",
								display:
									(input.name === "origem" &&
										truckValues["fazendaOrigem"] !==
										"Outros" &&
										truckValues["origem"] === "" &&
										"none") ||
									(input.name === "destino" &&
										truckValues["fazendaDestino"] !==
										"Outros" &&
										truckValues["destino"] === "" &&
										"none") ||
									(input.name === "projeto" &&
										truckValues["projeto"] === "" &&
										"none") ||
									(input.name === "parcela" &&
										truckValues["parcela"] === "" &&
										"none")
							}}
							disabled={
								(input.name === "origem" &&
									truckValues["fazendaOrigem"] !== "Outros" &&
									true) ||
								(input.name === "destino" &&
									truckValues["fazendaDestino"] !==
									"Outros" &&
									true)
							}
						/>
					);
				})}
			</Box>
			<SheetFields
				handleChangeTruck={handleChangeTruck}
				truckValues={truckValues}
			/>
			<Typography
				variant="h4"
				color={colors.blueOrigin[200]}
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
