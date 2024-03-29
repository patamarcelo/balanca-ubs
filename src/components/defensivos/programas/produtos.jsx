import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useSelector } from "react-redux";
import {
	selectOperacoes,
	selectAreas
} from "../../../store/programas/programas.selector";

import { useEffect, useState } from "react";

import styles from "./programas-styles.module.css";

const ProdutosComp = ({ program, estagio, tipo, calc, classes }) => {
	const operacoes = useSelector(selectOperacoes);
	const quantidades = useSelector(selectAreas);
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [operacoesFilt, setOperacoesFiltradas] = useState([]);
	const [quantidadeTotal, setQuantidadeTotal] = useState(0);

	useEffect(() => {
		if (quantidades) {
			const filtQuant = quantidades.filter(
				(data) => data.programa__nome === program
			)[0];
			if (filtQuant) {
				setQuantidadeTotal(filtQuant.total);
			}
		}
	}, [quantidades, program]);

	const transformTipo = (tipo, data, calc) => {
		if (tipo === "dose" && calc === "quantidade") {
			const total = quantidadeTotal * data;
			return total.toLocaleString("pt-br", {
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			});
		}
		if (tipo === "dose") {
			if (data < 50) {
				return data.toLocaleString("pt-br", {
					minimumFractionDigits: 3,
					maximumFractionDigits: 3
				});
			} else {
				return data.toLocaleString("pt-br", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				});
			}
		}
		return data;
	};

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
		<Box className={[styles.produtosMainContainer, styles[classes]]}>
			{operacoesFilt.length > 0 &&
				operacoesFilt
					.sort((a, b) =>
						a.defensivo__tipo.localeCompare(b.defensivo__tipo)
					)
					.map((data, i) => {
						return (
							<div key={i}>
								{transformTipo(tipo, data[tipo], calc).split('_').slice(0,2).join(" ")}
							</div>
						);
					})}
		</Box>
	);
};

export default ProdutosComp;
