import { Box } from "@mui/material";
import styles from "./programas-styles.module.css";
import ProdutosComp from "./produtos";

const EstagiosComp = ({ data, program }) => {
	console.log(data);
	const headerData = [
		{ title: "Estágio" },
		{ title: "DAP" },
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
						<div style={{ fontWeight: "bold" }}>{data.estagio}</div>
						<div>{data.prazo_dap}</div>
						<ProdutosComp
							program={program}
							estagio={data.estagio}
						/>
					</Box>
				);
			})}
		</Box>
	);
};

export default EstagiosComp;
