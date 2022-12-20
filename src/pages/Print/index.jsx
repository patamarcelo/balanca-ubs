import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";
import PrintLayout from "../../components/print-itens";

const PrintPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { state } = useLocation();

	const { data } = state;

	return <PrintLayout data={data} />;
};

export default PrintPage;
