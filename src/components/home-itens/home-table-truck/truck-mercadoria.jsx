import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import useMediaQuery from "@mui/material/useMediaQuery";

const MercadoriaTruck = (props) => {
	const { data } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isNonMobile = useMediaQuery("(min-width: 900px)");
	console.log('data:::', data)

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="space-around"
			alignItems="center"
			sx={{
				whiteSpace: !isNonMobile && "nowrap"
			}}
		>
			<>
				<Typography
					variant="h6"
					color={colors.primary[300]}
					sx={{ fontStyle: "italic" }}
				>
					Produto
				</Typography>
				<Typography variant="h6" color={colors.primary[100]}>
					{data?.mercadoria || `${data?.parcelasObjFiltered[0]?.cultura} - ${data?.parcelasObjFiltered[0]?.variedade}`}
				</Typography>
			</>
		</Box>
	);
};

export default MercadoriaTruck;
