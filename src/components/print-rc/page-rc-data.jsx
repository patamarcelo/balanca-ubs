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
		},
		{ label: "Cultura", value: data?.cultura }
	];
	const dictDataR = [
		{ label: "Peso Bruto", value: data?.pesoBruto },
		{ label: "Tara Veículo", value: data?.tara },
		{ label: "Peso Líquido", value: data?.liquido }
	];

	const DataDict = [
		{ label: "Entrada", value: data?.entrada },
		{ label: "Saída", value: data?.saida ? data.saida : " - " }
	];

	return (
		<Box
			height="100%"
			sx={{
				padding: "20px 50px",
				width: "100% !important"
			}}
		>
			<Box
				display="flex"
				justifyContent="start"
				sx={{
					width: "100%",
					height: "100px"
				}}
			>
				<img src={Logo} alt="logo" />
			</Box>
			<Box
				display="flex"
				justifyContent="space-between"
				sx={{ width: "100%" }}
			>
				<Box>
					{[
						"TICKET DE REQUISIÇÃO",
						`LAGOA DA CONFUSÃO-TO / ${
							data?.unidadeOp ? data.unidadeOp.toUpperCase() : ""
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
									{data}
								</Typography>
							</Box>
						);
					})}
				</Box>
				<Typography variant="h1" color={colors.primary[200]}>
					Pagina de Romaneio de carga
				</Typography>
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
				></Box>
			</Box>
		</Box>
	);
};

export default PageRcData;
