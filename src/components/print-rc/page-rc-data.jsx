import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Logo from "../../utils/assets/img/logo2.jpg";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";

import { UNITS_OP } from "../../store/trucks/trucks.types";

import classes from "./index.module.css";
import { formatDate } from "../../store/trucks/trucks.selector";

const PageRcData = ({ printValue }) => {
	const data = printValue[0];
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const user = useSelector(selectCurrentUser);

	const getName = (UNITS_OP, nameTo) => {
		if (nameTo) {
			const nameFiltered = UNITS_OP.filter(
				(data) => data.title === nameTo
			);
			return nameFiltered[0].description;
		}
	};
	const formatPlate = (placa) => {
		return (
			placa?.toUpperCase().slice(0, 3) +
			"-" +
			placa?.toUpperCase().slice(-4)
		);
	};

	const handleExistData = (data) => {
		if (data) {
			return data;
		}
		return " - ";
	};

	const dictData = [
		{ label: "Placa", value: formatPlate(data?.placa) },
		{
			label: "Motorista",
			value: handleExistData(data?.motorista)
		}
	];
	const dictDataR = [
		{ label: "CULTURA", value: handleExistData(data?.cultura) },
		{ label: "VARIEDADE", value: handleExistData(data?.mercadoria) }
	];

	const DataDict = [
		{ label: "Entrada", value: data?.entrada },
		{ label: "Saída", value: data?.saida ? data.saida : " - " }
	];
	const CordeDict = [
		{ label: "Origem", value: data?.fazendaOrigem },
		{ label: "Destino", value: data?.fazendaDestino }
	];
	const ProdDict = [
		{
			label: "Parcelas",
			value:
				handleExistData(data?.parcelasNovas) !== " - "
					? data?.parcelasNovas?.toString().replaceAll(",", " , ")
					: " - "
		}
	];

	return (
		<Box
			height="100%"
			sx={{
				padding: "15px",
				width: "100% !important",
				border: "1px solid",
				borderColor: colors.blueOrigin[700],
				borderRadius: "8px",
				margin: "30px"
			}}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="end"
				sx={{
					width: "100%",
					height: "180px"
				}}
			>
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="space-between"
					alignItems="space-between"
					height="100%"
				>
					<Box mt={3}>
						<img src={Logo} alt="logo" />
					</Box>
					<Box>
						{[
							`LAGOA DA CONFUSÃO - TO / ${
								data?.unidadeOp
									? getName(UNITS_OP, data.unidadeOp)
									: ""
							}`
						].map((data, i) => {
							return (
								<Box key={i}>
									<Typography
										variant="h6"
										color={colors.primary[700]}
										fontWeight="bold"
										sx={{
											padding: "3px 0",
											marginBottom: i === 1 ? "15px" : ""
										}}
									>
										{data.split("/")[1]} <br />{" "}
										{data.split("/")[0]}
									</Typography>
								</Box>
							);
						})}
					</Box>
				</Box>
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="space-between"
					alignItems="space-between"
					height="100%"
				>
					<Typography
						color={colors.redAccent[400]}
						fontWeight="bold"
						alignSelf={"center"}
						mt={6}
						fontSize={"16px"}
					>
						{data.relatorioColheita
							? `Nº ${data.relatorioColheita}`
							: ""}
					</Typography>
					<Typography
						color={colors.primary[700]}
						fontWeight="bold"
						sx={{
							fontSize: "12px",
							textAlign: "end",
							marginRight: "5px",
							marginLeft: "auto",
							width: "100%"
						}}
					>
						{formatDate(data.createdAt)}
					</Typography>
				</Box>
			</Box>

			<Box
				display="flex"
				justifyContent="space-between"
				sx={{ width: "100%" }}
			>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					sx={{
						width: "100%",
						backgroundColor: colors.blueOrigin[700],
						padding: "5px"
					}}
				>
					<Typography variant="h4" color="whitesmoke">
						CONTROLE DE COLHEITA
					</Typography>
				</Box>
			</Box>
			<Box
				display="flex"
				justifyContent="start"
				sx={{
					border: `1px  ${colors.blueOrigin[700]} dotted`,
					borderBottom: "none"
				}}
				mt={2}
			>
				{dictDataR.map((data, i) => {
					return (
						<Box
							key={i}
							display="flex"
							justifyContent="start"
							alignItems="center"
							sx={{
								width: "100%",
								padding: "0px 10px 0px 0px",
								margin: "10px"
							}}
						>
							<Typography
								variant="h6"
								color={colors.primary[500]}
								fontWeight="bold"
							>
								{data.label}:
							</Typography>
							<Typography
								variant="h6"
								color={colors.primary[500]}
								sx={{ marginLeft: "10px" }}
							>
								{data.value}
							</Typography>
						</Box>
					);
				})}
			</Box>
			<Box
				display="flex"
				justifyContent="start"
				sx={{ border: `1px  ${colors.blueOrigin[700]} dotted` }}
				mb={2}
			>
				{ProdDict.map((data, i) => {
					return (
						<Box
							display="flex"
							justifyContent="start"
							// flexDirection="column"
							alignItems="center"
							sx={{
								width: "100%",
								padding: "0px 10px 0px 0px",
								margin: "10px"
							}}
						>
							<Typography
								variant="h6"
								color={colors.primary[500]}
								fontWeight="bold"
							>
								{data.label}:
							</Typography>
							<Typography
								variant="h6"
								color={colors.primary[500]}
								sx={{ marginLeft: "10px" }}
							>
								{data.value}
							</Typography>
						</Box>
					);
				})}
			</Box>
			<Box
				display="flex"
				justifyContent="space-between"
				sx={{ width: "100%" }}
			>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					sx={{
						width: "100%",
						backgroundColor: colors.blueOrigin[700],
						padding: "5px"
					}}
				>
					<Typography variant="h4" color="whitesmoke">
						TRANSPORTE
					</Typography>
				</Box>
			</Box>
			<Box
				display="flex"
				justifyContent="start"
				mt={2}
				sx={{
					border: `1px  ${colors.blueOrigin[700]} dotted`,
					borderBottom: "none"
				}}
			>
				{dictData.map((data, i) => {
					return (
						<Box
							display="flex"
							justifyContent="start"
							// flexDirection="column"
							alignItems="center"
							sx={{
								width: "100%",
								padding: "0px 10px 0px 0px",
								margin: "10px"
							}}
						>
							<Typography
								variant="h6"
								color={colors.primary[500]}
								fontWeight="bold"
							>
								{data.label}:
							</Typography>
							<Typography
								variant="h6"
								color={colors.primary[500]}
								sx={{ marginLeft: "10px" }}
							>
								{data.value}
							</Typography>
						</Box>
					);
				})}
			</Box>
			<Box
				display="flex"
				justifyContent="start"
				sx={{
					border: `1px  ${colors.blueOrigin[700]} dotted`
				}}
			>
				{CordeDict.map((data, i) => {
					return (
						<Box
							display="flex"
							justifyContent="start"
							// flexDirection="column"
							alignItems="center"
							sx={{
								width: "100%",
								padding: "0px 10px 0px 0px",
								margin: "10px"
							}}
						>
							<Typography
								variant="h6"
								color={colors.primary[500]}
								fontWeight="bold"
							>
								{data.label}:
							</Typography>
							<Typography
								variant="h6"
								color={colors.primary[500]}
								sx={{ marginLeft: "10px" }}
							>
								{data.value}
							</Typography>
						</Box>
					);
				})}
			</Box>
			<Box
				mt="70px"
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={6}
				sx={{
					width: "100%"
				}}
			>
				<Box
					display="flex"
					justifyContent="center"
					flexDirection="column"
					sx={{
						width: "40%",
						alignItems: "center"
					}}
				>
					<Box
						display="flex"
						justifyContent="center"
						sx={{
							width: "100%",
							borderTop: "1px solid black"
						}}
					>
						<Typography
							variant="h6"
							color={colors.grey[800]}
							fontWeight="bold"
						>
							{user?.displayName}
						</Typography>
					</Box>
				</Box>
				<Box
					display="flex"
					justifyContent="center"
					flexDirection="column"
					sx={{
						width: "40%",
						alignItems: "center"
					}}
				>
					<Box
						display="flex"
						justifyContent="center"
						sx={{
							width: "100%",
							borderTop: "1px solid black"
						}}
					>
						<Typography
							variant="h6"
							color={colors.grey[800]}
							fontWeight="bold"
							sx={{
								textTransform: "capitalize"
							}}
						>
							{data.motorista ? data.motorista : "Motorista"}
						</Typography>
					</Box>
				</Box>
			</Box>

			<Box
				sx={{
					display: "flex",
					with: "100%",
					justifyContent: "space-between",
					alignItems: "flex-end"
				}}
			>
				{data?.coords && (
					<Typography
						color={colors.grey[500]}
						sx={{ fontSize: "0.7rem" }}
					>
						<a
							href={`https://maps.google.com/?q=${data.coords.coords.latitude},${data.coords.coords.longitude}`}
							target="_blank"
							rel="noreferrer"
						>
							Coordenadas: {data.coords.coords.latitude},{" "}
							{data.coords.coords.longitude}
						</a>
					</Typography>
				)}
				<Typography
					color={colors.grey[500]}
					sx={{ fontSize: "0.7rem" }}
				>
					{data.id}
				</Typography>
			</Box>
		</Box>
	);
};

export default PageRcData;
