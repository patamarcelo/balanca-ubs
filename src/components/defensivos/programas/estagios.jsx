import { Box } from "@mui/material";
import styles from "./programas-styles.module.css";
import ProdutosComp from "./produtos";

const EstagiosComp = ({ data, program }) => {
	console.log(data);
	const headerData = [
		{ title: "Estágio" },
		{ title: "Produto" },
		{ title: "Tipo" },
		{ title: "Dose Kg/Lt ha" },
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
				gap: "5px"
			}}
		>
			<Box className={styles.headerEstagios}>
				{headerData.map((data, i) => {
					return <div key={i}>{data.title}</div>;
				})}
			</Box>
			{data.map((data, i) => {
				return (
					<Box className={styles.estagioContainer} key={i}>
						<div className={styles.estagioTitle}>
							<div style={{ fontWeight: "bold" }}>
								{data.estagio}
							</div>
							<div>dap: {data.prazo_dap}</div>
						</div>
						<ProdutosComp
							program={program}
							estagio={data.estagio}
							tipo={"defensivo__produto"}
						/>
						<ProdutosComp
							program={program}
							estagio={data.estagio}
							tipo={"defensivo__tipo"}
						/>
						<ProdutosComp
							program={program}
							estagio={data.estagio}
							tipo={"dose"}
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
