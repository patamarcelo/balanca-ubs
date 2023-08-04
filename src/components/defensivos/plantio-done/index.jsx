import { Box } from "@mui/material";

import classes from "./plantio-done-page.module.css";

import { useEffect, useState } from "react";

import djangoApi from "../../../utils/axios/axios.utils";
import PlantioDoneTable from "./data-table-plantio-done";
import LoaderHomeSkeleton from "../home/loader";

import { useSelector } from "react-redux";
import { selectSafraCiclo } from "../../../store/plantio/plantio.selector";

const PlantioDonePage = () => {
	const safraCiclo = useSelector(selectSafraCiclo);

	const [dataF, setDataF] = useState([]);

	const [isLoading, setIsLoading] = useState(true);
	const [params, setParams] = useState({
		safra: safraCiclo.safra,
		ciclo: safraCiclo.ciclo
	});

	useEffect(() => {
		setParams({
			safra: safraCiclo.safra,
			ciclo: safraCiclo.ciclo
		});
	}, [safraCiclo]);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				await djangoApi
					.post("plantio/get_plantio_done/", params, {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						// console.log(res.data);
						const newData = res.data.data.map((data, i) => ({
							...data,
							id: i,
							area_colheita: data.area_colheita
								? data.area_colheita
										.toFixed(2)
										.toString()
										.replace(".", ",")
								: "",
							data_plantio: data.data_plantio
								? data.data_plantio
										.split("-")
										.reverse()
										.join("/")
								: "",
							data_plantio_inicio: data.cronograma_programa
								? data["cronograma_programa__0"]["Data Plantio"]
										.split("-")
										.reverse()
										.join("/")
								: ""
						}));
						setDataF(newData);
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log("Erro ao consumir a API", err);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [params]);

	return (
		<>
			<Box className={classes.container}>
				{isLoading && <LoaderHomeSkeleton />}

				{!isLoading && dataF && (
					<>
						<PlantioDoneTable loading={isLoading} rows={dataF} />
					</>
				)}
			</Box>
		</>
	);
};
export default PlantioDonePage;
