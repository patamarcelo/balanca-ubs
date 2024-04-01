import { Alert, Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import HeaderFarm from "./header-farm";
import TableColheita from "./table";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ } from "@fortawesome/free-solid-svg-icons";

const ColheitaAtual = (props) => {
	const { filteredFarm, selectedFarm, handlerFilter, selectedFilteredData, idsPending } =
		props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [areaTotal, setAreaTotal] = useState(0);
	const [parcelasTotal, setparcelasTotal] = useState(0);
	const [areaColhidaParcial, setAreaColhidaParcial] = useState(0);
	const [areaDisponivel, setAreaDisponivel] = useState(0);
	const [newDayNow, setNewDayNow] = useState("");

	const [dateSort, setDateSort] = useState(false);

	const formatArea = (number) => {
		return Number(number).toLocaleString("pt-br", {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		});
	};
	useEffect(() => {
		let areaTotalSoma = 0;
		let parcelasTotalCount = 0;
		let areaColhida = 0
		selectedFilteredData.forEach((data) => {
			areaTotalSoma += data.area_colheita;
			parcelasTotalCount += 1;
			areaColhida += data.area_parcial
		});
		const areaDisponivel = areaTotalSoma - areaColhida
		setAreaTotal(formatArea(areaTotalSoma));
		setparcelasTotal(parcelasTotalCount);
		setAreaColhidaParcial(formatArea(areaColhida))
		setAreaDisponivel(formatArea(areaDisponivel))

	}, [selectedFilteredData]);

	useEffect(() => {
		setNewDayNow(new Date().toLocaleDateString());
	}, []);

	const handleFilterTable = () => {
		setDateSort(!dateSort);
	};

	return (
		<Box
			width={"100%"}
			justifyContent={"flex-start"}
			alignItems={"flex-start"}
			display={"flex"}
			flexDirection={"column"}
			paddingLeft={6}
			paddingRight={6}
			paddingTop={2}
			paddingBottom={2}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-start",
					gap: "10px",
					alignItems: "flex-start",
					width: "100%",
					marginBottom: "20px"
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
								handlerFilter={handlerFilter}
							/>
						);
					})}
			</Box>
			<Box display={"flex"} flexDirection="row" gap={10} mb={2} sx={{color: colors.textColor[100]}}>
				<span>
					<b>Área Disponível:</b> <br /> {areaDisponivel} Hectares
				</span>
				<span>
					<b>Parcelas:</b> <br />{parcelasTotal}
				</span>
			</Box>
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
			</Box>
			<Box
				sx={{
					justifySelf: "center",
					width: "100%",
					marginBottom: "10px",
					textAlign: "center",
					backgroundColor: "rgba(128,128,128,0.4)",
					padding: "10px"
				}}
			>
				<Typography
					variant="h4"
					color={colors.textColor[100]}
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
					data={selectedFilteredData.sort((b, a) =>
						dateSort
							? b.talhao__id_talhao.localeCompare(
									a.talhao__id_talhao
							  )
							: a.dap - b.dap
					)}
				/>
			)}
		</Box>
	);
};

export default ColheitaAtual;
