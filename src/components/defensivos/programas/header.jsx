import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import Logo from "../../../utils/assets/img/logo-2.png";

import styles from "./programas-styles.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectOperacoes } from "../../../store/programas/programas.selector";

const HeaderComp = (props) => {
	const { data, quantidadeTotal } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const operacoes = useSelector(selectOperacoes);
	function transformarTexto(input) {
		if(data.nome === input)return input
		// Exemplo: "P24/25 - 3  Arroz Medio"

		// Atualiza o trecho da safra: P24/25 -> P25/26
		const novaSafra = input.replace(/P(\d{2})\/(\d{2})/, (_, ano1, ano2) => {
			const novoAno1 = parseInt(ano1);
			const novoAno2 = parseInt(ano2);
			return `P${novoAno1}/${novoAno2}`;
		});

		// Remove o número do ciclo no meio (ex: "- 3 ")
		const semCiclo = novaSafra.replace(/- *\d+ */, '-  ');

		// Corrige acentuação se necessário (ex: "Medio" → "Médio")
		const corrigido = semCiclo.replace(/Medio/i, 'Médio');

		return corrigido.trim();
	}
	const filterOperations = operacoes.filter((dataProgram) => {
		return transformarTexto(dataProgram.operacao__programa__nome) === data.nome
	})
	
	const totalCost = filterOperations.reduce((acc, curr) => acc += curr.valor_aplicacao, 0)

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "10px 10px",
				width: "100%",
				textAlign: "center",
				backgroundColor: colors.blueOrigin[500],
				marginBottom: "20px",
				borderRadius: "8px",
				boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 5px",
				position: 'sticky',
				top: "0",

			}}
		>
			<Box
				display="flex"
				justifyContent="start"
				sx={{
					width: "10px",
					height: "50px"
				}}
			>
				<img src={Logo} alt="logo" style={{ borderRadius: "4px" }} />
			</Box>
			<Typography
				variant="h2"
				color={"white"}
				sx={{ alignSelf: "center", fontFamily: "Times New Roman " }}
			>
				{data.nome_fantasia}
			</Typography>
			<div className={styles.areaTotalContainer}>
				<Typography
					variant="h6"
					color={colors.primary[100]}
					sx={{ marginBottom: "-5px" }}
				>
					R$ {totalCost.toLocaleString("pt-br", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}{" "} / Há
				</Typography>
				<Typography
					variant="h6"
					color={colors.primary[100]}
					sx={{ marginBottom: "-5px" }}
				>
					{quantidadeTotal.toLocaleString("pt-br", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}{" "} Há
				</Typography>
				<Typography
					variant="h6"
					color={colors.primary[100]}
					sx={{ marginBottom: "-5px" }}
				>
					<b>{data.safra__safra}</b> - <b>{data.ciclo__ciclo}</b>
				</Typography>
			</div>
		</Box>
	);
};

export default HeaderComp;
