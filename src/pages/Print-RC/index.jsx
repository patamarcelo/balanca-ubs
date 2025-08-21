import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";
import PrintRCLayout from "../../components/print-rc";

const PrintRCPage = ({data: propData}) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { state } = useLocation();

	const data = propData || state?.data; // se veio via prop, usa propData, senão usa state


	return <PrintRCLayout data={data} />;
};

export default PrintRCPage;
