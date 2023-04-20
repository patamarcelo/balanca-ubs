import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Logo from "../../utils/assets/img/logo.jpg";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";

const PageRcData = ({ printValue }) => {
	const data = printValue[0];
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const user = useSelector(selectCurrentUser);

	const formatPlate = (placa) => {
		return (
			placa?.toUpperCase().slice(0, 3) +
			"-" +
			placa?.toUpperCase().slice(-4)
		);
	};

	console.log(data.parcelasNovas);
	console.log(typeof data.parcelasNovas);

	const dictData = [
		{ label: "Placa", value: formatPlate(data?.placa) },
		{
			label: "Motorista",
			value: data?.motorista ? data.motorista : " - "
		}
	];
	const dictDataR = [
		{ label: "FAZENDA / PROJETO", value: data?.fazendaOrigem },
		{ label: "CULTURA", value: data?.cultura },
		{ label: "VARIEDADE", value: data?.variedade },
		{ label: "ROMANEIO", value: data?.relatorioColheita }
	];

	const DataDict = [
		{ label: "Entrada", value: data?.entrada },
		{ label: "Saída", value: data?.saida ? data.saida : " - " }
	];

	return (
		<Box
			height="100%"
			sx={{
				padding: "20px",
				width: "100% !important",
				border: "1px solid",
				borderColor: colors.blueOrigin[700],
				borderRadius: "8px",
				margin: "30px"
			}}
		>
			<Box
				display="flex"
				justifyContent="start"
				alignItems="end"
				sx={{
					width: "100%",
					height: "100px"
				}}
			>
				<img src={Logo} alt="logo" />
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
					{data.entrada}
				</Typography>
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
			<Box display="flex" justifyContent="start">
				{dictDataR.map((data, i) => {
					return (
						<Box
							display="flex"
							justifyContent="start"
							// flexDirection="column"
							alignItems="center"
							sx={{
								width: "100%",
								padding: "10px",
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
			<Box display="flex" justifyContent="start">
				{dictData.map((data, i) => {
					return (
						<Box
							display="flex"
							justifyContent="start"
							// flexDirection="column"
							alignItems="center"
							sx={{
								width: "100%",
								padding: "10px",
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
		</Box>
	);
};

export default PageRcData;
