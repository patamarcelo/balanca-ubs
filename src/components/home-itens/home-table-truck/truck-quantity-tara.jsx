import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const QuantityTruck = (props) => {
	const { data } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const taraFormated = Number(data.tara).toLocaleString("pt-BR") + " Kg";

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="space-around"
			alignItems="center"
		>
			{data.tara > 0 ? (
				<>
					<Typography
						variant="h6"
						color={colors.primary[300]}
						sx={{ fontStyle: "italic" }}
					>
						Tara Veículo
					</Typography>
					<Typography variant="h6" color={colors.primary[100]}>
						{taraFormated}
					</Typography>
				</>
			) : (
				<>
					<Typography
						variant="h6"
						color={colors.primary[300]}
						sx={{ fontStyle: "italic" }}
					>
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

export default QuantityTruck;
