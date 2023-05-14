import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useState, useEffect } from "react";
import classes from "./data-program.module.css";

const DataProgramPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { dataDef, isLoadingHome } = props;

	const [farmList, setFarmList] = useState([]);
	const [farmParcelasList, setFarmParcelasList] = useState([]);

	const [filteredList, setFilteredList] = useState([]);
	const [farmSelected, setFarmSelected] = useState("");

	useEffect(() => {
		const listFarm = dataDef
			.filter((data) => data.dados.plantio_finalizado === true)
			.map((data, i) => {
				return data.fazenda;
			});
		setFarmList([...new Set(listFarm)]);
	}, []);

	const handleFilterList = (farmName) => {
		setFarmSelected(farmName);
		const filtList = dataDef.filter(
			(data) =>
				data.fazenda === farmName &&
				data.dados.plantio_finalizado === true
		);
		setFilteredList(filtList);
	};

	useEffect(() => {
		const filtParcelas = filteredList.map((data, i) => {
			const initialDate = "2023-05-12";
			const finalDate = "2023-05-29";
			const cronograma = data.dados.cronograma;
			const cronArr = cronograma.map((cron, i) => {
				let cronOb;
				const dataPrev = cron["data prevista"];
				if (dataPrev >= initialDate && dataPrev <= finalDate) {
					const estagio = cron.estagio;
					const dataPrevApp = dataPrev;
					const dapApp = cron.dap;
					const parcela = data.parcela;
					const variedade = data.dados.variedade;
					const dataPlantio = data.dados.data_plantio;
					const area = data.dados.area_colheita;
					const dap = data.dados.dap;
					cronOb = {
						parcela,
						variedade,
						dataPlantio,
						estagio,
						dataPrevApp,
						dapApp,
						area,
						dap
					};
				}
				return cronOb;
			});
			return cronArr.filter((data) => data !== undefined);
		});
		setFarmParcelasList(
			filtParcelas
				.flat()
				.sort(
					(a, b) => new Date(a.dataPrevApp) - new Date(b.dataPrevApp)
				)
		);
		console.log(
			filtParcelas
				.flat()
				.sort(
					(a, b) => new Date(a.dataPrevApp) - new Date(b.dataPrevApp)
				)
		);
	}, [filteredList]);

	return (
		<Box className={classes.mainDiv}>
			<Box className={classes.div}>
				{farmList.map((data, i) => {
					return (
						<Box key={i}>
							<Typography
								variant="h5"
								color={colors.greenAccent[500]}
								onClick={() => handleFilterList(data)}
							>
								{data}
							</Typography>
						</Box>
					);
				})}
			</Box>
			<Box className={classes["box-program"]}>
				<Box className={classes["fazenda-div"]}>{farmSelected}</Box>
				<Box className={classes["geral-program-div"]}>
					{farmParcelasList.map((data, i) => {
						return (
							<div key={i} className={classes["parcelas-div"]}>
								<div>
									<p>{data.parcela}</p>
								</div>
								<div>
									<p>{data.variedade}</p>
								</div>
								<div>
									<p>{data.estagio}</p>
								</div>
								<div>
									<p>{data.dataPrevApp}</p>
								</div>
								<div>
									<p>{data.area}</p>
								</div>
							</div>
						);
					})}
				</Box>
			</Box>
		</Box>
	);
};

export default DataProgramPage;
