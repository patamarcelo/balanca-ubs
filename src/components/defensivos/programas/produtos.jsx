import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useSelector } from "react-redux";
import { selectOperacoes } from "../../../store/programas/programas.selector";

import { useEffect, useState } from "react";

import styles from "./programas-styles.module.css";

const ProdutosComp = ({ program, estagio }) => {
	const operacoes = useSelector(selectOperacoes);
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [operacoesFilt, setOperacoesFiltradas] = useState([]);

	useEffect(() => {
		if (operacoes) {
			const filtOperacoes = operacoes.filter((data) => {
				return (
					data.operacao__programa__nome === program &&
					data.operacao__estagio === estagio
				);
			});
			console.log(filtOperacoes);
			setOperacoesFiltradas(filtOperacoes);
		}
	}, []);

	useEffect(() => {
		if (operacoes) {
			const filtOperacoes = operacoes.filter((data) => {
				return (
					data.operacao__programa__nome === program &&
					data.operacao__estagio === estagio
				);
			});
			setOperacoesFiltradas(filtOperacoes);
		}
	}, [program, estagio, operacoes]);

	return (
		<Box className={styles.produtosMainContainer}>
			{operacoesFilt.length > 0 &&
				operacoesFilt.map((data, i) => {
					return (
						<>
							<div key={i}>{data.defensivo__produto}</div>
						</>
					);
				})}
		</Box>
	);
};

export default ProdutosComp;
