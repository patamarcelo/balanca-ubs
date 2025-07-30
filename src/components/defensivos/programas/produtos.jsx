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

	function capitalizeFirstLetter(str) {
		if (!str) return '';
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}

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
		if (tipo === 'valor_aplicacao') {
			if(data > 0){

				return 'R$ ' + data.toLocaleString("pt-br", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				});
			}
			return  'R$ 0,00'
		}
		if (tipo === 'defensivo__tipo') {
			return capitalizeFirstLetter(data);
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
						if (tipo === 'valor_aplicacao') {
							return (
								<div key={i}
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										width: '100%',
										paddingLeft: 10,
										paddingRight: 10
									}}
								>
									{transformTipo(tipo, data[tipo], calc).split('_').slice(0, 2).join(" ")}
									{
										tipo === 'valor_aplicacao' &&
										<b style={{
											fontSize: '0.9em',
											color: data["valor_final"] === 0 ? '#ba8e23' : 'grey',
											fontWeight: 'bold',
											textDecoration: 'italic',
										}}> {transformTipo(tipo, data['valor_final'], calc).split('_').slice(0, 2).join(" ").replace('R$ ', '')}</b>
									}
								</div>
							);
						} else {
							return (
								<div key={i}>
									{transformTipo(tipo, data[tipo], calc).split('_').slice(0, 2).join(" ")}
								</div>
							);
						}
					})}
		</Box>
	);
};

export default ProdutosComp;
