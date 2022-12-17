import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CustomButton from "../../components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import HomeTable from "../../components/home-table";

const HomePage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box
			display="flex"
			flexDirection="column"
			gap="30px"
			sx={{
				width: "100%",
				height: "100%"
				// border: "1px solid white"
			}}
		>
			<Box>
				<CustomButton
					title="Carregando"
					color={colors.greenAccent[600]}
				>
					<FontAwesomeIcon icon={faTruckMoving} />
				</CustomButton>

				<CustomButton
					title="Descarregando"
					color={colors.redAccent[600]}
					ml={20}
				>
					<FontAwesomeIcon icon={faTruckMoving} />
				</CustomButton>
			</Box>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				height="50%"
				sx={{
					backgroundColor: colors.blueOrigin[800],
					borderRadius: '8px'
				}}
			>
				<HomeTable />
			</Box>
		</Box>
	);
};

export default HomePage;
