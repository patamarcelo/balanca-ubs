import { Alert, Box, Typography, useTheme } from "@mui/material";
import {
	Grid,
	Card,
	CardContent,
} from "@mui/material";
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import CancelIcon from '@mui/icons-material/Cancel';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { tokens } from "../../../theme";
import HeaderFarm from "./header-farm";
import TableColheita from "./table";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ } from "@fortawesome/free-solid-svg-icons";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ColheitaAtual = (props) => {
	const {
		filteredFarm,
		selectedFarm,
		handlerFilter,
		selectedFilteredData,
		idsPending,
		resumeFarmRomaneios
	} = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [areaTotal, setAreaTotal] = useState(0);
	const [parcelasTotal, setparcelasTotal] = useState(0);
	const [areaColhidaParcial, setAreaColhidaParcial] = useState(0);
	const [areaDisponivel, setAreaDisponivel] = useState(0);
	const [newDayNow, setNewDayNow] = useState("");

	const [checkedColheita, setCheckedColheita] = useState(true);
	const [chekedAreasAvaiable, setChekedAreasAvaiable] = useState(false);

	const [dateSort, setDateSort] = useState(false);

	const [varieSelect, setVarieSelect] = useState([]);

	const [varSelectedArr, setVarSelectedArr] = useState([]);

	const formatArea = (number) => {
		return Number(number).toLocaleString("pt-br", {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		});
	};
	useEffect(() => {
		let areaTotalSoma = 0;
		let parcelasTotalCount = 0;
		let areaColhida = 0;
		selectedFilteredData.forEach((data) => {
			areaTotalSoma += data.area_colheita;
			parcelasTotalCount += 1;
			areaColhida += data.area_parcial;
		});
		const areaDisponivel = areaTotalSoma - areaColhida;
		setAreaTotal(formatArea(areaTotalSoma));
		setparcelasTotal(parcelasTotalCount);
		setAreaColhidaParcial(formatArea(areaColhida));
		setAreaDisponivel(formatArea(areaDisponivel));
	}, [selectedFilteredData]);

	useEffect(() => {
		setNewDayNow(new Date().toLocaleDateString());
	}, []);

	const handleFilterTable = () => {
		setDateSort(!dateSort);
	};

	const handleChangeCheck = (event) => {
		setCheckedColheita(event.target.checked);
	};
	const handleChangeAreasCheck = (event) => {
		setChekedAreasAvaiable(event.target.checked);
	};

	const handleChangeVarSelect = (event) => {
		const {
			target: { value },
		} = event;
		setVarieSelect(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
	};

	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: 200,
			},
		},
	};

	function getStyles(name, personName, theme) {
		return {
			fontWeight: personName.includes(name)
				? theme.typography.fontWeightMedium
				: theme.typography.fontWeightRegular,
		};
	}

	useEffect(() => {
		if(selectedFilteredData.length > 0) {
			const onlyVar = selectedFilteredData.map((data) => data.variedade__nome_fantasia)
			const rempveDuplicate = [...new Set(onlyVar)]
			setVarSelectedArr(rempveDuplicate)
		}
	}, [selectedFilteredData, setVarSelectedArr]);


	useEffect(() => {
		setVarieSelect([])
	}, [selectedFarm]);


	return (
		<Box
			width={"100%"}
			justifyContent={"flex-start"}
			alignItems={"flex-start"}
			display={"flex"}
			flexDirection={"column"}
			paddingLeft={6}
			paddingRight={6}
			paddingBottom={2}
			sx={{
				minWidth: "1200px"
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-start",
					gap: "10px",
					alignItems: "flex-start",
					width: "100%",
					marginBottom: "20px",
					minWidth: "1200px"
				}}
			>
				{filteredFarm
					.sort((a, b) => a.localeCompare(b))
					.map((farm, i) => {
						return (
							<HeaderFarm
								selectedFarm={selectedFarm}
								farm={farm}
								key={i}
								index={i}
								handlerFilter={handlerFilter}
							/>
						);
					})}
			</Box>
			<Grid container spacing={2} sx={{ mb: 3, minWidth: "1200px" }}>
				<Grid item xs={2}>
					<Card
						sx={{
							backgroundColor: theme.palette.mode === "light" && "whitesmoke"
						}}
					>
						<CardContent sx={{ paddingBottom: "16px !important" }}>
							<Typography variant="h6" fontWeight={"bold"}>
								Área Disponível
							</Typography>
							<Typography variant="body1">{areaDisponivel} Hectares</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={2}>
					<Card
						sx={{
							backgroundColor: theme.palette.mode === "light" && "whitesmoke"
						}}
					>
						<CardContent sx={{ paddingBottom: "16px !important" }}>
							<Typography variant="h6" fontWeight={"bold"}>
								Parcelas
							</Typography>
							<Typography variant="body1">{parcelasTotal}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={2}>
					<Card
						sx={{
							backgroundColor: theme.palette.mode === "light" && "whitesmoke"
						}}
					>
						<CardContent sx={{ paddingBottom: "16px !important" }}>
							<Typography variant="h6" fontWeight={"bold"}>
								Romaneios Pendentes
							</Typography>
							<Typography variant="body1">
								{resumeFarmRomaneios[selectedFarm]
									? resumeFarmRomaneios[selectedFarm]
									: " - "}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<Box
				display="flex"
				flexDirection="row-reverse"
				justifyContent="space-between"
				width={"100%"}
			>
				<Typography
					sx={{
						alignSelf: "flex-end",
						color: colors.grey[300],
						fontStyle: "italic"
					}}
				>
					{newDayNow}
				</Typography>

				<Box
					sx={{
						display: "flex",
						gap: "30px",
						alignItems: "center"
					}}
				>
					<FontAwesomeIcon
						icon={faArrowDownAZ}
						color={colors.greenAccent[500]}
						size="sm"
						style={{
							margin: "0px 0px",
							cursor: "pointer"
						}}
						onClick={() => handleFilterTable()}
					/>
					<FormControlLabel
						control={
							<Switch
								color="secondary"
								checked={checkedColheita}
								onChange={handleChangeCheck}
							/>
						}
						label="Colheita Andamento"
						sx={{ color: colors.textColor[100] }}
					/>
					<FormControlLabel
						control={
							<Switch
								color="secondary"
								checked={chekedAreasAvaiable}
								onChange={handleChangeAreasCheck}
							/>
						}
						label="Areas Dispoíveis"
						sx={{ color: colors.textColor[100] }}
					/>
					<FormControl sx={{ m: 1, width: 300 }}>
						<InputLabel id="demo-multiple-name-label">Variedade</InputLabel>
						<Select
							labelId="demo-multiple-name-label"
							id="demo-multiple-name"
							multiple
							value={varieSelect}
							onChange={handleChangeVarSelect}
							input={<OutlinedInput label="Variedade" />}
							MenuProps={MenuProps}
							size="small"
						>
							{varSelectedArr.map((name) => (
								<MenuItem
									key={name}
									value={name}
									style={getStyles(name, varieSelect, theme)}
								>
									{name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</Box>
			<Box
				sx={{
					justifySelf: "center",
					width: "100%",
					marginBottom: "10px",
					textAlign: "center",
					// backgroundColor: "rgba(128,128,128,0.4)",
					backgroundColor: colors.blueOrigin[400],
					// backgroundColor:'blue',
					padding: "10px"
				}}
			>
				<Typography
					variant="h4"
					// color={colors.textColor[100]}
					color="whitesmoke"
					sx={{ fontWeight: "bold" }}
				>
					{selectedFarm?.replace("Projeto", "")}
				</Typography>
			</Box>
			{selectedFilteredData.length > 0 && (
				<TableColheita
					theme={theme}
					colors={colors}
					idsPending={idsPending}
					setVarSelectedArr={setVarSelectedArr}
					setVarieSelect={setVarieSelect}
					data={selectedFilteredData
						.filter((data) => 
							varieSelect?.length > 0 ? varieSelect.includes(data.variedade__nome_fantasia) :
						data.variedade__nome_fantasia !== null
						)
						.filter((data) =>
							chekedAreasAvaiable
								? data.area_colheita - data.area_parcial !== 0
								: data.area_colheita !== null
						)
						.filter((data) =>
							checkedColheita
								? data.finalizado_colheita === false
								: data.finalizado_colheita !== null
						)
						.sort((b, a) =>
							dateSort
								? b.talhao__id_talhao.localeCompare(a.talhao__id_talhao)
								: a.dap - b.dap
						)}
				/>
			)}
		</Box>
	);
};

export default ColheitaAtual;
