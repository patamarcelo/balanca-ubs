import { Box, Typography } from "@mui/material";
import styles from "./produtividade.module.css";

const ListPage = (props) => {
	const { filteredArray } = props;
	return (
		<div className={styles.mainContainer}>
			{filteredArray &&
				filteredArray.map((data, i) => {
					return (
						<Box key={i} className={styles.innerContainer}>
							<span>{data.talhao__fazenda__nome} - </span>
							<span>{data.talhao__id_talhao} - </span>
							<span>{data.area_colheita} - </span>
							<span>
								{data?.peso_kg?.toLocaleString("pt-br", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}{" "}
								-{" "}
							</span>
							<span>
								{data?.peso_scs?.toLocaleString("pt-br", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}{" "}
								-{" "}
							</span>
							<span>
								{data?.produtividade?.toLocaleString("pt-br", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}{" "}
								-{" "}
							</span>
						</Box>
					);
				})}
		</div>
	);
};

export default ListPage;
