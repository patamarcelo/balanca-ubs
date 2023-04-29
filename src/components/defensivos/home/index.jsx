import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import djangoApi from "../../../utils/axios/axios.utils";

import { useEffect } from "react";
import DataDefensivoPage from "../data-table";

const HomeDefensivoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isOpen, setIsOpen] = useState(false);
	const [dataDef, setDataDef] = useState([]);
	const { isLoadingHome } = props;

	useEffect(() => {
		djangoApi
			.get("plantio/get_plantio_operacoes_detail/", {
				headers: {
					Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
				}
			})
			.then((res) => {
				// console.log(res.data);
				setDataDef(res.data.dados);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<Box width="100%" height="100%">
			<Typography variant="h2" color={colors.blueAccent[700]}>
				Pagina dos defensivos
			</Typography>
			<DataDefensivoPage isLoadingHome={isLoadingHome} data={dataDef} />
		</Box>
	);
};

export default HomeDefensivoPage;
