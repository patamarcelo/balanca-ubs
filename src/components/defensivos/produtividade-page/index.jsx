import { Box, Typography } from "@mui/material";
import djangoApi from "../../../utils/axios/axios.utils";
import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";

import SelectFarm from "./select-farm";
import MapPage from "./map-page";
import ListPage from "./list-page";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ProdutividadePage = () => {
	const [params, setParams] = useState({
		safra: "2023/2024",
		ciclo: "1"
	});
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [produtividade, setProdutividade] = useState([]);
	const [loadingData, setLoadingData] = useState(false);
	const [projetos, setProjetos] = useState([]);
	const [selectedProject, setSelectedProject] = useState();
	const [filteredArray, setFilteredArray] = useState([]);

	const handleChangeSelect = (event) => {
		setSelectedProject(event.target.value);
	};
	useEffect(() => {
		const filterArray = produtividade.filter(
			(data) => data.talhao__fazenda__nome === selectedProject
		);
		setFilteredArray(filterArray);
	}, [selectedProject, produtividade]);
	useEffect(() => {
		const onlyProjetos = produtividade.map((data) => {
			return data.talhao__fazenda__nome;
		});
		setProjetos([...new Set(onlyProjetos)]);
	}, [produtividade]);

	useEffect(() => {
		(async () => {
			setLoadingData(true);
			try {
				await djangoApi
					.post("plantio/get_produtividade_plantio/", params, {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						console.log(res.data.dados_plantio);
						setProdutividade(res.data.dados_plantio);
					});
			} catch (err) {
				console.log(err);
			} finally {
				setLoadingData(false);
			}
		})();
	}, []);

	if (loadingData) {
		return (
			<Box
				sx={{
					width: "90%",
					margin: "0 auto",
					paddingTop: "20px"
				}}
			>
				<LinearProgress color="warning" />
			</Box>
		);
	}
	if (filteredArray.length === 0) {
		return (
			<Box>
				<SelectFarm
					projetos={projetos}
					handleChange={handleChangeSelect}
					value={selectedProject}
				/>
				<h1>Selecione uma fazenda</h1>
			</Box>
		);
	}
	if (filteredArray.length > 0) {
		return (
			<Box
				sx={{
					marginLeft: "10px",
					marginRight: "10px"
				}}
			>
				<Box>
					<SelectFarm
						projetos={projetos}
						handleChange={handleChangeSelect}
						value={selectedProject}
					/>
				</Box>
				<Box
					sx={{
						display: "flex",
						width: "100%",
						justifyContent: "space-between",
						alignItems: "center",
						backgroundColor: colors.blueOrigin[700],
						padding: "20px",
						borderRadius: "8px"
					}}
				>
					<Box
						width={"67%"}
						display="flex"
						justifyContent="center"
						alignItems="center"
						height="550px"
						sx={{
							boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 15px",
							borderRadius: "8px"
						}}
					>
						<MapPage />
					</Box>
					<Box width={"30%"}>
						<ListPage
							filteredArray={filteredArray}
							projeto={selectedProject}
						/>
					</Box>
				</Box>
			</Box>
		);
	}
	return <Box></Box>;
};

export default ProdutividadePage;
