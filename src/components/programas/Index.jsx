import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import LoaderHomeSkeleton from "..//defensivos/home/loader";

import djangoApi from "../../utils/axios/axios.utils";

import styles from "./programas-styles.module.css";

import { useDispatch } from "react-redux";
import {
	setOperacoes,
	setEstagios,
	setProgramas
} from "../../store/programas/programa.actions";

const ProgramasSection = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();

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
	);
};

export default ProgramasSection;
