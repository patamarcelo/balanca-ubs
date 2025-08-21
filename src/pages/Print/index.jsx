import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";
import PrintLayout from "../../components/print-itens";

const PrintPage = ({data: propData}) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { state } = useLocation();

	const data = propData || state?.data; // se veio via prop, usa propData, senão usa state


	return <PrintLayout data={data} />;
};

export default PrintPage;
