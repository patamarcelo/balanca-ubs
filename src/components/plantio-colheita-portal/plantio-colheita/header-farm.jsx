import { Box } from "@mui/material";
import styles from "./plantio-colheita.module.css";

const HeaderFarm = ({ farm, handlerFilter, selectedFarm }) => {
	return (
		<Box
			sx={{ cursor: "pointer" }}
			onClick={() => handlerFilter(farm)}
			className={`${styles.containerHeader} ${
				farm === selectedFarm && styles.isSelectedFarm
			}`}
		>
			<p className={styles.headerTitle}>{farm.replace("Projeto", "")}</p>
		</Box>
	);
};

export default HeaderFarm;
