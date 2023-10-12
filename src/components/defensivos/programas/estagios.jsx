import { Box } from "@mui/material";
import styles from "./programas-styles.module.css";
import ProdutosComp from "./produtos";

const EstagiosComp = ({ data, program }) => {
	const headerData = [
		{ title: "Estágio" },
		{ title: "Produto" },
		{ title: "Tipo" },
		{ title: "Dose Kg/Lt ha" },
		{ title: "Quantidade" },
		{ title: "Observação" }
	];
	return (
		<Box
			sx={{
				color: "black",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				gap: "5px",
				width: "100%"
			}}
		>
			<Box className={styles.headerEstagios}>
				{headerData.map((data, i) => {
					return <div key={i}>{data.title}</div>;
				})}
			</Box>
			{data
				.sort((a, b) => a.prazo_dap - b.prazo_dap)
				.map((data, i) => {
					return (
						<Box
							className={[
								`${styles["estagioContainer"]}
								${i === 11 && "pageBreak"}`
							]}
							key={i}
						>
							<div className={styles.estagioTitle}>
								<div style={{ fontWeight: "bold" }}>
									{data.estagio}
								</div>
								<div>
									dap:{" "}
									{data.prazo_dap < 0 ? 0 : data.prazo_dap}
								</div>
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
