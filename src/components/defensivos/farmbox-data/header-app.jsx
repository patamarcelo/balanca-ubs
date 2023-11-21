import classes from "./farmbox.module.css";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const HeaderApp = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<div style={{ width: "100%" }} className={classes.headerApp}>
			<div className={classes.appDiv}>
				<div className={classes.labelDivApp}>
					<p>Nº</p>
					<p>Operação</p>
				</div>
				<div className={classes.numberDivApp}>
					<p>Área </p>
					<p>Aplicado</p>
					<p>Aberto</p>
					<p>Status</p>
				</div>
			</div>
		</div>
	);
};

export default HeaderApp;
