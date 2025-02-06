import { Box, Button } from "@mui/material";
import styles from "./plantio-colheita.module.css";

const HeaderFarm = ({ farm, index, handlerFilter, selectedFarm }) => {
	return (
		// <Box
		// 	sx={{ cursor: "pointer" }}
		// 	onClick={() => handlerFilter(farm)}
		// 	className={`${styles.containerHeader} ${
		// 		farm === selectedFarm && styles.isSelectedFarm
		// 	}`}
		// >
		// 	<p className={styles.headerTitle}>{farm.replace("Projeto", "")}</p>
		// </Box>
		<Button
			key={index}
			variant="contained"
			color="primary"
			onClick={() => handlerFilter(farm)}
			size="small"
			sx={{
				cursor: "pointer",
				textTransform: 'none',
				borderRadius: '6px', /* Smaller border radius */
				px: 2, /* Smaller padding on the x-axis */
				py: 1, /* Smaller padding on the y-axis */
				fontSize: '13px', /* Smaller font size */
				background: farm === selectedFarm ? 'linear-gradient(135deg, #f0f0f0, #d3d3d3)' : 'linear-gradient(135deg, #004b7a, #0076b6)',
				color: farm === selectedFarm ? '#000' : '#fff',
				fontWeight: farm === selectedFarm ? 'bold' : 'normal',
				boxShadow: farm === selectedFarm ? 'inset 0 0 8px rgba(0, 0, 0, 0.1)' : 'none',
				'&:hover': {
					background: farm === selectedFarm ? 'linear-gradient(135deg, #e0e0e0, #c3c3c3)' : 'linear-gradient(135deg, #003b63, #005a8f)',
				},
			}}
		>
			{farm.replace("Projeto", "")}
		</Button>
	);
};

export default HeaderFarm;
