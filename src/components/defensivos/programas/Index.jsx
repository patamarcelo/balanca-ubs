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
	setProgramas,
	setAreaTotal
} from "../../../store/programas/programa.actions";

import {
	selectProgramas,
	selectEstagios,
	selectOperacoes,
	selectAreas
} from "../../../store/programas/programas.selector";

import SelectFarm from "../produtividade-page/select-farm";

import CircularProgress from "@mui/material/CircularProgress";
import HeaderComp from "./header";
import EstagiosComp from "./estagios";
import ConsolidadosProdutos from "./consolidadosProdutos";

const ProgramasSection = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();
	const programas = useSelector(selectProgramas);

	const [selectedPrograma, setSelectedPrograma] = useState("");
	const [programArray, setSelectedProgramaArray] = useState(null);
	const [programData, setProgramData] = useState();

	const estagios = useSelector(selectEstagios);
	const [filteredEstagios, setFilteredEstagios] = useState([]);

	const operacoes = useSelector(selectOperacoes);
	const [filteredOperations, setFilteredOperations] = useState([]);

	const quantidades = useSelector(selectAreas);
	const [quantidadeTotal, setQuantidadeTotal] = useState(0);

	useEffect(() => {
		if (quantidades) {
			const filtQuant = quantidades.filter(
				(dataFilt) => dataFilt.programa__nome === selectedPrograma
			)[0];
			if (filtQuant) {
				setQuantidadeTotal(filtQuant.total);
			}
		}
	}, [quantidades, selectedPrograma]);

	useEffect(() => {
		const filteredOperations = operacoes.filter(
			(data) => data.operacao__programa__nome === selectedPrograma
		);
		if (filteredOperations.length > 0) {
			const reducerProducts = filteredOperations
				.sort((a, b) =>
					a.defensivo__produto.localeCompare(b.defensivo__produto)
				)
				.sort((a, b) =>
					a.defensivo__tipo.localeCompare(b.defensivo__tipo)
				)
				.reduce((acc, cur) => {
					if (!acc[cur.defensivo__produto]) {
						acc[cur.defensivo__produto] = {
							value: cur.dose,
							tipo: cur.defensivo__tipo
						};
					} else {
						acc[cur.defensivo__produto] = {
							value: (acc[cur.defensivo__produto].value +=
								cur.dose),
							tipo: cur.defensivo__tipo
						};
					}
					return acc;
				}, {});
			setFilteredOperations(reducerProducts);
		}
	}, [selectedPrograma, operacoes]);

	useEffect(() => {
		const onlyName = programas.map((data) => data.nome);
		setSelectedProgramaArray(onlyName);
	}, [programas]);

	const handleChangeSelect = (event) => {
		setSelectedPrograma(event.target.value);
		const filteredProgram = programas.filter(
			(data) => data.nome === event.target.value
		);

		const filtEstagios = estagios.filter(
			(data) => data.programa__nome === event.target.value
		);
		setFilteredEstagios(filtEstagios);

		setProgramData(filteredProgram[0]);
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
						dispatch(setAreaTotal(res.data.area_total));
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
					minHeight: "100%",
					backgroundColor: "#F5F6FA",
					borderRadius: "8px",
					padding: "20px",
					display: "flex",
					justifyContent: "center"
				}}
			>
				<Box className={styles.mainProgramContainer}>
					{programData ? (
						<>
							<HeaderComp
								data={programData}
								quantidadeTotal={quantidadeTotal}
							/>
							<EstagiosComp
								data={filteredEstagios}
								program={selectedPrograma}
							/>
							<hr />
							{filteredOperations && (
								<ConsolidadosProdutos
									filteredOperations={filteredOperations}
									quantidadeTotal={quantidadeTotal}
									program={selectedPrograma}
								/>
							)}
						</>
					) : (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: "100%"
							}}
						>
							<Typography
								variant="h1"
								color={colors.primary[900]}
							>
								Selecione um Programa
							</Typography>
						</Box>
					)}
				</Box>
			</Box>
		</>
	);
};

export default ProgramasSection;
