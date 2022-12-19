import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";
import PrintLayout from "../../components/print-itens";
import { useRef } from "react";

import { useReactToPrint } from "react-to-print";

const PrintPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { state } = useLocation();

	const { data } = state;
	console.log("Data from Print Page: ", data);
	return <PrintLayout data={data} />;
};

export default PrintPage;
