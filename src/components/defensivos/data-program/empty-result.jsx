import classes from "./data-program.module.css";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const EmptyResultPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<div
			className={classes.emptyResultPage}
			style={{
				backgroundColor: colors.blueOrigin[800],
				borderRadius: "8px"
			}}
		>
			<h1>Sem Aplicação pendente para este período!!</h1>
		</div>
	);
};

export default EmptyResultPage;
