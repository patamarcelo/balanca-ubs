import { Box, Typography, useTheme } from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import { useState, useEffect, useContext } from "react";
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

// import JsPDF from "jspdf";
import moment from "moment";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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

	const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
	const colorMode = useContext(ColorModeContext);

	// const generatePDF = () => {
	// 	const pdf = new JsPDF("portrait", "pt", "a4", false);

	// 	const contentHeight =
	// 		document.querySelector("#printDivProgram").offsetHeight;

	// 	// Set the maximum height of each page (adjust as needed)
	// 	const maxHeightPerPage = 1200; // For example, assuming each page can hold up to 800px of content

	// 	// Calculate the number of pages needed
	// 	const totalPages = Math.ceil(contentHeight / maxHeightPerPage);
	// 	console.log("total pages: ", totalPages);

	// 	const formatDate = "YYYY.MM.DD";
	// 	const today = new Date();
	// 	const dateNameFilte = moment(today).format(formatDate);

	// 	const saveFile = version
	// 		? `${dateNameFilte} - ${programData.nome_fantasia} - Versão ${version}`
	// 		: `${dateNameFilte} - ${programData.nome_fantasia}`;

	// 	let pWidth = pdf.internal.pageSize.width; // 595.28 is the width of a4
	// 	let srcWidth = document.getElementById("printDivProgram").scrollWidth;
	// 	let margin = 18; // narrow margin - 1.27 cm (36);
	// 	let scale = (pWidth - margin * 2) / srcWidth;

	// 	pdf.html(document.getElementById("printDivProgram"), {
	// 		x: margin,
	// 		y: margin,
	// 		margin: [25, 0, 25, 0],
	// 		autoPaging: "text",
	// 		html2canvas: {
	// 			scale: scale,
	// 			allowTaint: true,
	// 			useCORS: true
	// 		}
	// 		// callback: function () {
	// 		// 	window.open(pdf.output("bloburl"));
	// 		// }
	// 	}).then(() => {
	// 		pdf.save(`${saveFile}.pdf`);
	// 	});
	// };

	const generatePDF = async () => {
		try {
			setIsGeneratingPDF(true);

			// Oculta elementos não imprimíveis
			document.querySelectorAll(".print-safe-wrapper").forEach(el => {
				el.style.visibility = "hidden";
			});

			const actualTheme = theme.palette?.mode;
			// if (actualTheme === "dark") {
			// 	colorMode.toggleColorMode();
			// }

			await new Promise(res => setTimeout(res, 300));

			const pdf = new jsPDF("portrait", "pt", "a4");
			const pageHeight = pdf.internal.pageSize.getHeight();
			const pageWidth = pdf.internal.pageSize.getWidth();
			const margin = 20;
			const maxContentHeight = pageHeight - margin * 2;
			let currentY = margin;

			// Renderiza header e printVersionTop
			const renderBlock = async (target, options = {}) => {
				const el = typeof target === "string" ? document.querySelector(target) : target;
				if (!el) return null;

				const canvas = await html2canvas(el, {
					scale: 1.2, // Menor escala = menor peso
					useCORS: true,
					allowTaint: true,
				});

				const imgData = canvas.toDataURL("image/jpeg", 0.6); // Qualidade reduzida
				const imgProps = pdf.getImageProperties(imgData);
				const imgWidth = pageWidth - margin * 2;
				const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

				if (currentY + imgHeight > pageHeight - margin) {
					pdf.addPage();
					currentY = margin;
				}

				pdf.addImage(imgData, "JPEG", margin, currentY, imgWidth, imgHeight);
				currentY += imgHeight + (options.spacing ?? 15); // margem menor entre os blocos
			};

			// Renderiza header + printVersionTop (fixos)
			await renderBlock("#printVersionTop");
			await renderBlock("#headerComp");
			await renderBlock(".estagiosHeader", { spacing: 0 }); // Adiciona essa classe no JSX

			// Renderiza cada estágio individualmente
			const estagioContainers = document.querySelectorAll(".estagioContainer");
			for (const el of estagioContainers) {
				await renderBlock(el, { spacing: 5 });
			}

			// Renderiza printVersionBottom (opcional)
			await renderBlock("#printVersionBottom");

			// Gera o nome do arquivo
			const formatDate = "YYYY.MM.DD";
			const today = new Date();
			const dateNameFilte = moment(today).format(formatDate);
			const saveFile = version
				? `${dateNameFilte} - ${programData.nome_fantasia} - Versão ${version}`
				: `${dateNameFilte} - ${programData.nome_fantasia}`;

			pdf.save(`${saveFile}.pdf`);

			// if (actualTheme === "dark") {
			// 	colorMode.toggleColorMode();
			// }
		} catch (error) {
			console.error("Erro ao gerar PDF:", error);
		} finally {
			document.querySelectorAll(".print-safe-wrapper").forEach(el => {
				el.style.visibility = "visible";
			});
			setIsGeneratingPDF(false);
		}
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
								{isGeneratingPDF ? (
									<CircularProgress
										size={24}
										sx={{
											color: colors.blueAccent[500],
											marginRight: "12px",
										}}
									/>
								) : (
									<IconButton onClick={generatePDF}>
										<FontAwesomeIcon
											icon={faPrint}
											color={colors.blueAccent[500]}
											size={"sm"}
										/>
									</IconButton>
								)}
							</Box>
							<Box
								id="printDivProgram"
								sx={{ fontFamily: "Times New Roman !important" }}
							>
								{version && (
									<div id="printVersionTop">
										<PrintVersion programData={programData} version={version} />
									</div>
								)}
								<div id="headerComp">
									<HeaderComp data={programData} quantidadeTotal={quantidadeTotal} />
								</div>
								<div id="estagiosComp">
									<EstagiosComp data={filteredEstagios} program={selectedPrograma} />
								</div>
								{version && (
									<div id="printVersionBottom">
										<PrintVersion programData={programData} version={version} />
									</div>
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
