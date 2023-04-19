import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";
import PrintRCLayout from "../../components/print-rc";

const PrintRCPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { state } = useLocation();

	const { data } = state;

	return <PrintRCLayout data={data} />;
};

export default PrintRCPage;
