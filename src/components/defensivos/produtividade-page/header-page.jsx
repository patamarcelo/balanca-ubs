import { Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import styles from "./produtividade.module.css";

const HeaderPage = (props) => {
	const { selectedProject } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<div className={styles.headerPageDiv}>
			<div className={styles.headerNameDiv}>
				<Typography
					// variant="h3"
					color={colors.primary[100]}
					sx={{
						fontSize: "32px",
						textAlign: "left",
						padding: "5px",
						paddingLeft: "0px",
						marginLeft: "0px",
						fontWeight: "bold",
						// marginBottom: "10px",
						width: "100%"
						// backgroundColor: "red"
					}}
					className={styles.titleProdutividade}
				>
					{selectedProject}
				</Typography>
			</div>
			<div className={styles.prodSummary}>
				<div>SOJA</div>
				<div>FEIJAO</div>
				<div>ARROZ</div>
				<div>QUANTIDADE </div>
			</div>
		</div>
	);
};

export default HeaderPage;
