import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";

const PageDataClassFlex = ({ data }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const isNonMobile = useMediaQuery("(min-width: 1090px)");

	const getDestino = (data) => {
		if (data?.destino) {
			return data?.destino;
		}
		if (data?.fazendaDestino === "Outros") {
			return data?.destino;
		}
		if (data?.fazendaDestino !== "Outros" && data?.fazendaDestino !== null) {
			return data?.fazendaDestino;
		}
		return " - ";
	};

	const dictData = [
		{
			label: "Umidade",
			value: data?.umidade
				? parseFloat(data.umidade).toFixed(2).replace(".", ",")
				: data?.umidade,
			label2: "Impureza",
			value2: data?.impureza
				? parseFloat(data.impureza).toFixed(2).replace(".", ",")
				: data?.impureza,
			size: "25%"
		},
		{
			label: "Mercadoria",
			value: data?.mercadoria,
			label2: "Projeto",
			value2: data?.projeto,
			size: "40%"
		},
		{
			label: "Origem",
			value: data?.fazendaOrigem ? data?.fazendaOrigem : data?.origem,
			label2: "Destino",
			value2: getDestino(data),
			size: "35%"
		}
	];

	return (
		<Box
			display="flex"
			sx={{
				flexGrow: 1,
				border: "solid 1px black",
				padding: "4px"
			}}
		>
			{dictData.map((data, i) => {
				return (
					<Box
						key={i}
						display="flex"
						justifyContent="start"
						flexDirection="column"
						alignItems="center"
						sx={{
							width: data.size
						}}
					>
						<Box
							display="flex"
							justifyContent="space-between"
							pl={i > 0 ?? "15px"}
							sx={{
								borderBottom: "1px dotted black",
								borderRight: i === 2 ? "" : "1px dotted black",
								width: "100%"
							}}
						>
							<Typography
								variant="h6"
								fontWeight="bold"
								color={colors.primary[700]}
							>
								{data.label}:
							</Typography>
							<Box
								display="flex"
								justifyContent="center"
								mr={i === 1 ? "3px" : "10px"}
								sx={{
									flexGrow: 1
								}}
							>
								<Typography
									variant="h6"
									color={colors.primary[700]}
								>
									{data.value}
								</Typography>
							</Box>
						</Box>
						<Box
							display="flex"
							justifyContent="space-between"
							pl={i > 0 ?? "15px"}
							sx={{
								borderRight: i === 2 ? "" : "1px dotted black",
								width: "100%"
							}}
						>
							<Typography
								variant="h6"
								fontWeight="bold"
								color={colors.primary[700]}
							>
								{data.label2}:
							</Typography>
							<Box
								display="flex"
								justifyContent="center"
								mr={i === 1 ? "3px" : "10px"}
								sx={{
									flexGrow: 1
								}}
							>
								<Typography
									variant="h6"
									color={colors.primary[700]}
								>
									{data.value2}
								</Typography>
							</Box>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
};

export default PageDataClassFlex;
