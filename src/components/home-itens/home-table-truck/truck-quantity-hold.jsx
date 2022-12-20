import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const QuantityTruckHold = (props) => {
	const { data } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const taraFormated = Number(data.tara).toLocaleString("pt-BR") + " Kg";
	const brutoFormated =
		Number(data.pesoBruto).toLocaleString("pt-BR") + " Kg";

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="space-around"
			alignItems="center"
		>
			{data.tipo === "carregando" ? (
				<>
					<Typography variant="h6" color={colors.primary[300]} sx={{fontStyle: 'italic'}}>
						Peso Bruto
					</Typography>
					<Typography variant="h6" color={colors.yellow[700]}>
						Aguardando
					</Typography>
				</>
			) : (
				<>
					<Typography variant="h6" color={colors.primary[300]} sx={{fontStyle: 'italic'}}>
						Tara do Veículo
					</Typography>
					<Typography variant="h6" color={colors.yellow[700]}>
						Aguardando
					</Typography>
				</>
			)}
		</Box>
	);
};

export default QuantityTruckHold;
