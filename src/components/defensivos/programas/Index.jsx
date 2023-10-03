import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useState, useEffect } from "react";
import LoaderHomeSkeleton from "../home/loader";

import djangoApi from "../../../utils/axios/axios.utils";

import styles from "./programas-styles.module.css";

import { useDispatch, useSelector } from "react-redux";
import {
	setOperacoes,
	setEstagios,
	setProgramas
} from "../../../store/programas/programa.actions";

import { selectProgramas } from "../../../store/programas/programas.selector";

import SelectFarm from "../produtividade-page/select-farm";

import CircularProgress from "@mui/material/CircularProgress";

const ProgramasSection = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();
	const programas = useSelector(selectProgramas);
	const [selectedPrograma, setSelectedPrograma] = useState("");
	const [programArray, setSelectedProgramaArray] = useState(null);

	useEffect(() => {
		const onlyName = programas.map((data) => data.nome);
		setSelectedProgramaArray(onlyName);
	}, [programas]);

	const handleChangeSelect = (event) => {
		setSelectedPrograma(event.target.value);
	};

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				await djangoApi
					.get("programas/get_operacoes/", {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						dispatch(setOperacoes(res.data.dados));
						dispatch(setEstagios(res.data.estagios));
						dispatch(setProgramas(res.data.programas));
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log("Erro ao consumir a API", err);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	if (isLoading) {
		return (
			<Box className={styles["container-loader"]}>
				<LoaderHomeSkeleton />
			</Box>
		);
	}

	return (
		<>
			{programArray ? (
				<SelectFarm
					projetos={programArray}
					handleChange={handleChangeSelect}
					value={selectedPrograma}
					title={"Programas"}
				/>
			) : (
				<Box
					sx={{
						display: "flex",
						width: "50px",
						marginLeft: "30px",
						margin: "20px"
					}}
				>
					<CircularProgress color="secondary" size={20} />
				</Box>
			)}
			<Box
				sx={{
					width: "100%",
					height: "100%",
					backgroundColor: colors.primary[100],
					borderRadius: "8px",
					padding: "20px"
				}}
			>
				<Typography variant="h2" color={colors.primary[900]}>
					Pagina dos programas
				</Typography>
			</Box>
		</>
	);
};

export default ProgramasSection;
