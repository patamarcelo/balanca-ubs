import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./plantio-done-page.module.css";

import { useEffect, useState } from "react";

import djangoApi from "../../../utils/axios/axios.utils";
import PlantioDoneTable from "./data-table-plantio-done";
import LoaderHomeSkeleton from "../home/loader";

const PlantioDonePage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const safraDict = {
		first: "2022/2023",
		second: "2023/2024"
	};

	const cicloDict = {
		first: "1",
		second: "2",
		third: "3"
	};

	const [dataF, setDataF] = useState([]);
	const [safra, setSafra] = useState(safraDict.second);
	const [ciclo, setCiclo] = useState(cicloDict.first);

	const [isLoading, setIsLoading] = useState(true);

	const params = JSON.stringify({
		safra,
		ciclo
	});

	useEffect(() => {
		(async () => {
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
								.toFixed(2)
								.toString()
								.replace(".", ","),
							data_plantio: data.data_plantio
								.split("-")
								.reverse()
								.join("/"),
							data_plantio_inicio: data["cronograma_programa__0"]["Data Plantio"]
								.split("-")
								.reverse()
								.join("/")
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
	}, []);

	return (
		<>
			<Box className={classes.container} >
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
