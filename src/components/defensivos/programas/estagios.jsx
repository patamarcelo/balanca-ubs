import { Box } from "@mui/material";
import styles from "./programas-styles.module.css";
import ProdutosComp from "./produtos";
import { useSelector } from "react-redux";
import { selectOperacoes } from "../../../store/programas/programas.selector";

const EstagiosComp = ({ data, program }) => {
	const operacoes = useSelector(selectOperacoes);
	const headerData = [
		{ title: "Estágio" },
		{ title: "Produto" },
		{ title: "Tipo" },
		{ title: "Dose Kg/Lt ha" },
		{ title: "Quantidade" },
		{ title: "Custo / Há - Valor" },
		{ title: "Observação" }
	];
	function transformarTexto(input) {
		// console.log('input', input)
		// console.log('program', program)
		// console.log(program === input)
		if(program === input)return input
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
	return (
		<Box
			className={styles.gridLayoutEstagios}
			sx={{
				color: "black",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				gap: "5px",
				width: "100%",
				breakInside: "avoid",          // <- evita quebra
				pageBreakInside: "avoid",      // <- evita quebra em impressão
				WebkitColumnBreakInside: "avoid", // <- para compatibilidade
			}}
		>
			<Box className={[`${styles.headerEstagios} estagiosHeader`]}>
				{headerData.map((data, i) => {
					if (data.title === 'Custo / Há - Valor') {
						const parts = data.title.split(" - ");
						return (
							<div
								style={{
									display: 'flex',
									width: '100%',
									justifyContent: 'space-between',
									paddingLeft: 10,
									paddingRight: 10,
								}}
								key={i}
							>
								<b>{parts[0] || ''}</b>
								<b>{parts[1] || ''}</b>
							</div>
						);
					} else {
						return <div key={i}>{data.title}</div>;
					}
				})}
			</Box>
			{data
				.sort((a, b) => a.prazo_dap - b.prazo_dap)
				.map((data, i) => {
					const filterOperations = operacoes.filter((dataInside) => dataInside.operacao__estagio === data.estagio).filter((dataProgram) => {
						return transformarTexto(dataProgram.operacao__programa__nome) === program
					})
					const totalCost = filterOperations.reduce((acc, curr) => acc += curr.valor_aplicacao, 0)
					return (
						<Box
							className={[
								`${styles["estagioContainer"]}
								${i === 6 && "pageBreak"} pageBreakContainer estagioContainer`
							]}
							key={i}
							sx={{
								pageBreakInside: "avoid",
								pageBreakBefore: "always",
								pageBreakAfter: "always"
							}}
						>
							<div className={styles.estagioTitle}>
								<div style={{ textDecoration: "italic", color: 'grey', fontWeight: 'bold', fontSize: '0.9em' }}>
									{data.prazo_dap < 0 ? 0 : data.prazo_dap} dias
								</div>
								<div style={{ fontWeight: "bold", color: 'black', fontSize: '1em' }}>
									{data.estagio}
								</div>
								{
									totalCost > 0 &&
									<span className={styles.totalCostTitle}>
										R$ {totalCost.toLocaleString("pt-br", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
										})}
									</span>
								}
							</div>
							<ProdutosComp
								program={program}
								estagio={data.estagio}
								tipo={"defensivo__produto"}
								classes={"produtos"}
							/>
							<ProdutosComp
								program={program}
								estagio={data.estagio}
								tipo={"defensivo__tipo"}
								classes={"tipo"}
							/>
							<ProdutosComp
								program={program}
								estagio={data.estagio}
								tipo={"dose"}
								classes={"dose"}
							/>
							<ProdutosComp
								program={program}
								estagio={data.estagio}
								calc={"quantidade"}
								tipo={"dose"}
								classes={"quantidadeTotal"}
							/>
							<ProdutosComp
								program={program}
								estagio={data.estagio}
								calc={"quantidade"}
								tipo={"valor_aplicacao"}
								classes={"quantidadeTotal"}
							/>
							<div className={styles.obsMainContainer}>
								{data.obs}
							</div>
						</Box>
					);
				})}
		</Box>
	);
};

export default EstagiosComp;
