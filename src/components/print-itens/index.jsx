import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './index.css'

const PrintLayout = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const print = (e) => {
		console.log("imprimindo", e);
		window.print();
	};
	return (
		<>
			<Box
			sx={{ 
				cursor: "pointer",
				marginBottom: '10px'
			}}
			display="flex"
			width="70%"
			justifyContent="end"
			>
				<FontAwesomeIcon
					onClick={print}
					color={colors.grey[200]}
					icon={faPrint}
					size="xl"
				/>
			</Box>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				id="printablediv"
				sx={{
					width: "70%",
					height: "70%",
					backgroundColor: "whitesmoke",
					boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
				}}
			>
				<Typography variant="h3" color={colors.primary[900]}>
					teste pagina
				</Typography>
			</Box>
		</>
	);
};

export default PrintLayout;
