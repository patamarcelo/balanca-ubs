import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./plantio-done-page.module.css";

import { useEffect, useState } from "react";

import djangoApi from "../../../utils/axios/axios.utils";
import PlantioDoneTable from "./data-table-plantio-done";
import LoaderHomeSkeleton from "../home/loader";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

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

	const [age, setAge] = useState("");

	const handleChange = (event) => {
		setSafra(event.target.value);
	};

	const handleChangeCiclo = (event) => {
		setCiclo(event.target.value);
	};

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

	useEffect(() => {
		console.log(safra);
		console.log(ciclo);
	}, [safra, ciclo]);

	return (
		<>
			<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
				<InputLabel id="demo-simple-select-standard-label-safra">
					Safra
				</InputLabel>
				<Select
					labelId="demo-simple-select-standard-label-safra"
					id="demo-simple-select-standard-safra"
					value={safra}
					onChange={handleChange}
					label="Safra"
				>
					<MenuItem value="">
						<em>Safra</em>
					</MenuItem>
					<MenuItem value={safraDict.first}>2022/2023</MenuItem>
					<MenuItem value={safraDict.second}>2023/2024</MenuItem>
				</Select>
			</FormControl>
			<FormControl
				variant="standard"
				sx={{ m: 1, minWidth: 120, marginLeft: "80px" }}
			>
				<InputLabel id="demo-simple-select-standard-label-ciclo">
					Ciclo
				</InputLabel>
				<Select
					labelId="demo-simple-select-standard-label-ciclo"
					id="demo-simple-select-standard-ciclo"
					value={ciclo}
					onChange={handleChangeCiclo}
					label="Ciclo"
				>
					<MenuItem value="">
						<em>Ciclo</em>
					</MenuItem>
					<MenuItem value={cicloDict.first}>
						{cicloDict.first}
					</MenuItem>
					<MenuItem value={cicloDict.second}>
						{cicloDict.second}
					</MenuItem>
					<MenuItem value={cicloDict.third}>
						{cicloDict.third}
					</MenuItem>
				</Select>
			</FormControl>
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
