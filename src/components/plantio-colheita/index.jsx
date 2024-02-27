import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import styles from "./plantio-colheita.module.css";

const ListaRender = (props) => {
	const {
		data: {
			area_colheita,
			talhao__fazenda__nome,
			talhao__id_talhao,
			data_plantio,
			peso,
			romaneios,
			area_parcial,
			dap
		}
	} = props;

	const areaParcial = area_parcial ? area_parcial : 0;
	const formatDate = (data) => {
		const newDate = new Date(data);
		const formatedDate = newDate.toLocaleDateString("pt-BR");
		return formatedDate;
	};

	return (
		<Box className={styles.mainContainer}>
			<p>{formatDate(data_plantio)}</p>
			<p>{dap}</p>
			<p>{talhao__fazenda__nome.replace("Projeto", "")}</p>
			<p>{talhao__id_talhao}</p>
			<p>{area_colheita}</p>
			<p>{areaParcial}</p>
			<p>{peso}</p>
			<p>{romaneios}</p>
		</Box>
	);
};

export default ListaRender;
