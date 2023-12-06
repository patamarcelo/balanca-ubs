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
	setAreaTotal,
	setFilteredOperationsAction
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

import "./programa-print.css";

import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import PrintVersion from "./print-version";

import JsPDF from "jspdf";
import moment from "moment";

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
	const [filteredOpForTYpes, setFilteredOpForTYpes] = useState([]);
	const [filteredOperations, setFilteredOperations] = useState([]);

	const quantidades = useSelector(selectAreas);
	const [quantidadeTotal, setQuantidadeTotal] = useState(0);

	const [selectedTypes, setSelectedTypes] = useState([]);
	const [selectedTypesInput, setSelectedTypesInput] = useState([]);

	const [version, setVersion] = useState("");

	const generatePDF = () => {
		const pdf = new JsPDF("portrait", "pt", "a4", false);
		// var source = document.querySelector("#printDivProgram");

		// report.html(document.querySelector("#printDivProgram")).then(() => {
		// 	report.save("Programa.pdf");
		// });
		// Calculate the height of the content
		const contentHeight =
			document.querySelector("#printDivProgram").offsetHeight;

		// Set the maximum height of each page (adjust as needed)
		const maxHeightPerPage = 1200; // For example, assuming each page can hold up to 800px of content

		// Calculate the number of pages needed
		const totalPages = Math.ceil(contentHeight / maxHeightPerPage);
		console.log("total pages: ", totalPages);

		// Generate the PDF
		// const pdf = new jsPDF();

		// Loop through the pages
		// for (let i = 0; i < totalPages; i++) {
		// 	if (i > 0) {
		// 		pdf.addPage(); // Add a new page for subsequent pages
		// 	}

		// 	// Render the content of the current page
		// 	pdf.fromHTML(document.body, 15, 15, { pagesplit: true });
		// }

		const formatDate = "YYYY.MM.DD";
		const today = new Date();
		const dateNameFilte = moment(today).format(formatDate);

		const saveFile = version
			? `${dateNameFilte} - ${programData.nome_fantasia} - Versão ${version}`
			: `${dateNameFilte} - ${programData.nome_fantasia}`;

		let pWidth = pdf.internal.pageSize.width; // 595.28 is the width of a4
		let srcWidth = document.getElementById("printDivProgram").scrollWidth;
		let margin = 18; // narrow margin - 1.27 cm (36);
		let scale = (pWidth - margin * 2) / srcWidth;

		pdf.html(document.getElementById("printDivProgram"), {
			x: margin,
			y: margin,
			autoPaging: "text",
			html2canvas: {
				scale: scale
			}
			// callback: function () {
			// 	window.open(pdf.output("bloburl"));
			// }
		}).then(() => {
			pdf.save(`${saveFile}.pdf`);
		});
	};
	// useEffect(() => {
	// 	if (programData) {
	// 		setVersion(programData.versao);
	// 	}
	// }, [programData]);

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
		const filteredOperations = filteredOpForTYpes.filter(
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
	}, [selectedPrograma, filteredOpForTYpes, selectedTypesInput]);

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
		setVersion(filteredProgram[0]["versao"]);
	};

	useEffect(() => {
		if (selectedPrograma) {
			const filteredType = Object.keys(filteredOperations).map((data) => {
				return filteredOperations[data].tipo;
			});
			const removeDubble = [...new Set([...filteredType])];
			setSelectedTypes(removeDubble);
		}
	}, [selectedPrograma, filteredOperations]);

	const handleTypeSelect = (e) => {
		setSelectedTypesInput(e.target.value);
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
						setFilteredOpForTYpes(res.data.dados);
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

	useEffect(() => {
		const newob = { arr: filteredOpForTYpes, inputs: selectedTypesInput };
		dispatch(setFilteredOperationsAction(newob));
	}, [selectedTypesInput, dispatch, filteredOpForTYpes]);

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
					width={280}
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
			{selectedPrograma ? (
				<SelectFarm
					projetos={selectedTypes}
					handleChange={handleTypeSelect}
					value={selectedTypesInput}
					title={"Tipos"}
					multiple={true}
					width={200}
					ml={4}
				/>
			) : (
				<></>
			)}
			<Box
				sx={{
					width: "100%",
					minWidth: "1080px",
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
							<Box
								sx={{ justifyContent: "start", width: "100%" }}
							>
								<label style={{ color: "black" }}>
									Versão
									<input
										type="text"
										value={version}
										style={{ marginLeft: "5px" }}
										placeholder="Versão para impressão"
										onChange={(e) =>
											setVersion(e.target.value)
										}
									/>
								</label>
							</Box>
							<Box sx={{ alignSelf: "end" }}>
								<IconButton onClick={generatePDF}>
									{/* <IconButton onClick={() => window.print()}> */}
									<FontAwesomeIcon
										icon={faPrint}
										color={colors.blueAccent[500]}
										size={"sm"}
									/>
								</IconButton>
							</Box>
							<Box
								id="printDivProgram"
								sx={{
									fontFamily: "Times New Roman !important"
								}}
							>
								{version && (
									<PrintVersion
										programData={programData}
										version={version}
									/>
								)}
								<HeaderComp
									data={programData}
									quantidadeTotal={quantidadeTotal}
								/>
								<EstagiosComp
									data={filteredEstagios}
									program={selectedPrograma}
								/>
								{version && (
									<PrintVersion
										programData={programData}
										version={version}
									/>
								)}
							</Box>
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
