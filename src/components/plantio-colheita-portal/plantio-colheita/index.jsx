import {
	Box,
	Typography,
	useTheme,
	Paper,
	Grid,
	Card,
	CardContent,
	Fab,
	Tooltip,
	FormControlLabel,
	Switch,
	OutlinedInput,
	InputLabel,
	MenuItem,
	FormControl,
	Select,
	IconButton,
} from "@mui/material";

import { tokens } from "../../../theme";

import HeaderFarm from "./header-farm";
import TableColheita from "./table";
import LinearProgressWithLabel from "./progress-bar";

import {
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
	faArrowDownAZ,
	faFileExcel,
} from "@fortawesome/free-solid-svg-icons";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";

import html2canvas from "html2canvas";

import { exportPlantiosToExcel } from "./export-excel-helper";


/**
 * ============================================================
 * PRINT
 * ============================================================
 */

export async function printNodeAsPng(
	node,
	fileName = "colheita"
) {
	if (!node) return;

	try {
		const padding = 20;

		const width =
			node.offsetWidth +
			padding * 2;

		const height =
			node.offsetHeight +
			padding * 2;

		const canvas =
			await html2canvas(
				node,
				{
					backgroundColor:
						"#ffffff",

					scale: 2,

					useCORS:
						true,

					allowTaint:
						true,

					width,

					height,

					x:
						-padding,

					y:
						-padding,

					onclone: (
						clonedDoc
					) => {
						const items =
							clonedDoc.querySelectorAll(
								"*"
							);

						items.forEach(
							(el) => {
								if (
									window.getComputedStyle(
										el
									)
										.position ===
									"sticky"
								) {
									el.style.position =
										"static";
								}
							}
						);

						const clonedNode =
							clonedDoc.querySelector(
								"[data-html2canvas-ignore]"
							)
								?.parentElement ||
							clonedDoc
								.body
								.firstChild;

						if (
							clonedNode
						) {
							clonedNode.style.width =
								`${node.offsetWidth}px`;

							clonedNode.style.overflow =
								"hidden";
						}
					},
				}
			);

		const dataUrl =
			canvas.toDataURL(
				"image/png"
			);

		const a =
			document.createElement(
				"a"
			);

		a.href =
			dataUrl;

		a.download =
			`${fileName}.png`;

		a.click();
	} catch (err) {
		console.error(
			"Erro na captura:",
			err
		);
	}
}


/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

const getParcelaKey = (
	data
) => {
	const talhao =
		String(
			data
				?.talhao__id_talhao ??
			""
		).trim();

	const variedade =
		String(
			data
				?.variedade__nome_fantasia ??
			""
		).trim();

	return `${talhao}|||${variedade}`;
};


const naturalSort = (
	a,
	b
) => {
	return String(
		a
	).localeCompare(
		String(
			b
		),
		"pt-BR",
		{
			numeric:
				true,

			sensitivity:
				"base",
		}
	);
};


/**
 * ============================================================
 * COMPONENTE
 * ============================================================
 */

const ColheitaAtual = (
	props
) => {
	const {
		filteredFarm,
		selectedFarm,
		handlerFilter,
		selectedFilteredData,
		idsPending,
	} = props;


	const theme =
		useTheme();

	const colors =
		tokens(
			theme.palette.mode
		);


	/**
	 * ========================================================
	 * KPIs
	 * ========================================================
	 */

	const [
		areaTotal,
		setAreaTotal,
	] = useState(
		0
	);

	const [
		parcelasTotal,
		setParcelasTotal,
	] = useState(
		0
	);

	const [
		areaColhidaParcial,
		setAreaColhidaParcial,
	] = useState(
		0
	);

	const [
		areaTotalProgress,
		setAreaTotalProgress,
	] = useState(
		0
	);

	const [
		areaDisponivel,
		setAreaDisponivel,
	] = useState(
		0
	);

	const [
		areaColhida,
		setAreaColhida,
	] = useState(
		0
	);

	const [
		totalPesoCarregado,
		setTotalPesoCarregado,
	] = useState(
		0
	);

	const [
		totalProdutividade,
		setTotalProdutividade,
	] = useState(
		0
	);

	const [
		totalProdutividadeReal,
		setTotalProdutividadeReal,
	] = useState(
		0
	);

	const [
		totalRomaneios,
		setTotalRomaneios,
	] = useState(
		0
	);


	/**
	 * ========================================================
	 * DATA
	 * ========================================================
	 */

	const [
		newDayNow,
		setNewDayNow,
	] = useState(
		""
	);


	/**
	 * ========================================================
	 * FILTROS
	 * ========================================================
	 */

	const [
		checkedColheita,
		setCheckedColheita,
	] = useState(
		true
	);

	const [
		checkedColheitaFinalizada,
		setCheckedColheitaFinalizada,
	] = useState(
		false
	);

	const [
		checkedAlgumaAreaColhida,
		setCheckedAlgumaAreaColhida,
	] = useState(
		false
	);

	const [
		chekedAreasAvaiable,
		setChekedAreasAvaiable,
	] = useState(
		false
	);

	const [
		romaneiosPendente,
		setRomaneiosPendente,
	] = useState(
		false
	);

	const [
		fAreaParcialGt0SemRomaneios,
		setFAreaParcialGt0SemRomaneios,
	] = useState(
		false
	);

	const [
		fAreaParcialEq0ComRomaneios,
		setFAreaParcialEq0ComRomaneios,
	] = useState(
		false
	);


	/**
	 * ========================================================
	 * ORDENAÇÃO
	 * ========================================================
	 */

	const [
		dateSort,
		setDateSort,
	] = useState(
		false
	);


	/**
	 * ========================================================
	 * VARIEDADE
	 * ========================================================
	 */

	const [
		varieSelect,
		setVarieSelect,
	] = useState(
		[]
	);

	const [
		varSelectedArr,
		setVarSelectedArr,
	] = useState(
		[]
	);


	/**
	 * ========================================================
	 * TALHÃO
	 * ========================================================
	 */

	const [
		parcelaSelect,
		setParcelaSelect,
	] = useState(
		[]
	);


	const tableRef =
		useRef(
			null
		);


	/**
	 * ========================================================
	 * SWITCHES COMPACTOS
	 * ========================================================
	 */

	const switchLabelSx = {
		color:
			colors
				.textColor[
				100
			],

		marginRight:
			0,

		marginLeft:
			0,

		flexShrink:
			1,

		"& .MuiFormControlLabel-label":
			{
				fontSize:
					"0.7rem",

				lineHeight:
					1.05,

				fontWeight:
					500,

				whiteSpace:
					"normal",

				maxWidth:
					"105px",
			},

		"& .MuiSwitch-root":
			{
				marginRight:
					"1px",
			},
	};


	/**
	 * ========================================================
	 * HELPERS
	 * ========================================================
	 */

	const formatArea = (
		number
	) => {
		return Number(
			number ||
			0
		).toLocaleString(
			"pt-br",
			{
				maximumFractionDigits:
					2,

				minimumFractionDigits:
					2,
			}
		);
	};


	const getPendingCount =
		(
			id
		) =>
			Number(
				idsPending?.[
					id
				] ||
				0
			);


	const getComputedCount =
		(
			carga
		) =>
			Number(
				carga
					?.romaneios ||
				0
			);


	/**
	 * ========================================================
	 * PRINT
	 * ========================================================
	 */

	const handlePrintTable =
		async () => {
			const node =
				tableRef.current;

			await printNodeAsPng(
				node,
				"colheita"
			);
		};


	/**
	 * ========================================================
	 * VARIEDADES
	 * ========================================================
	 */

	useEffect(
		() => {
			if (
				!selectedFilteredData
					?.length
			) {
				setVarSelectedArr(
					[]
				);

				return;
			}


			const variedades =
				selectedFilteredData
					.map(
						(
							data
						) =>
							data
								.variedade__nome_fantasia
					)
					.filter(
						Boolean
					);


			const unique =
				[
					...new Set(
						variedades
					),
				].sort(
					naturalSort
				);


			setVarSelectedArr(
				unique
			);
		},
		[
			selectedFilteredData,
		]
	);


	/**
	 * ========================================================
	 * TALHÕES
	 * ========================================================
	 */

	const parcelaOptions =
		useMemo(
			() => {
				const optionsMap =
					new Map();


				(
					selectedFilteredData ||
					[]
				)
					.filter(
						(
							data
						) => {
							if (
								varieSelect.length ===
								0
							) {
								return true;
							}


							return varieSelect.includes(
								data
									.variedade__nome_fantasia
							);
						}
					)
					.forEach(
						(
							data
						) => {
							const talhao =
								String(
									data
										?.talhao__id_talhao ??
									""
								).trim();


							const variedade =
								String(
									data
										?.variedade__nome_fantasia ??
									""
								).trim();


							if (
								!talhao
							) {
								return;
							}


							const value =
								getParcelaKey(
									data
								);


							const label =
								variedade
									? `${talhao} - ${variedade}`
									: talhao;


							optionsMap.set(
								value,
								{
									value,
									label,
									talhao,
									variedade,
								}
							);
						}
					);


				return Array.from(
					optionsMap.values()
				).sort(
					(
						a,
						b
					) =>
						naturalSort(
							a.label,
							b.label
						)
				);
			},
			[
				selectedFilteredData,
				varieSelect,
			]
		);


	/**
	 * ========================================================
	 * REMOVE TALHÕES INVÁLIDOS
	 * ========================================================
	 */

	useEffect(
		() => {
			setParcelaSelect(
				(
					current
				) => {
					if (
						current.length ===
						0
					) {
						return current;
					}


					const validValues =
						new Set(
							parcelaOptions.map(
								(
									option
								) =>
									option.value
							)
						);


					const next =
						current.filter(
							(
								value
							) =>
								validValues.has(
									value
								)
						);


					if (
						next.length ===
						current.length
					) {
						return current;
					}


					return next;
				}
			);
		},
		[
			parcelaOptions,
		]
	);


	/**
	 * ========================================================
	 * DADOS FILTRADOS
	 * ========================================================
	 */

	const filteredData =
		useMemo(
			() => {
				return (
					selectedFilteredData ||
					[]
				)

					/**
					 * VARIEDADE
					 */
					.filter(
						(
							data
						) =>
							varieSelect?.length >
							0
								? varieSelect.includes(
										data
											.variedade__nome_fantasia
									)
								: data
										.variedade__nome_fantasia !==
									null
					)

					/**
					 * TALHÃO
					 */
					.filter(
						(
							data
						) =>
							parcelaSelect?.length >
							0
								? parcelaSelect.includes(
										getParcelaKey(
											data
										)
									)
								: true
					)

					/**
					 * ÁREAS DISPONÍVEIS
					 */
					.filter(
						(
							data
						) =>
							chekedAreasAvaiable
								? Number(
										data
											.area_colheita ||
											0
									) -
										Number(
											data
												.area_parcial ||
												0
										) !==
									0
								: data
										.area_colheita !==
									null
					)

					/**
					 * STATUS
					 */
					.filter(
						(
							data
						) => {
							const areaTotalItem =
								Number(
									data
										.area_colheita ||
										0
								);


							const areaColhidaItem =
								Number(
									data
										.area_parcial ||
										0
								);


							const finalizadaPorFlag =
								data
									.finalizado_colheita ===
									true ||
								data
									.finalizado_colheita ===
									1 ||
								data
									.finalizado_colheita ===
									"true";


							const finalizadaPorArea =
								areaTotalItem >
									0 &&
								areaColhidaItem >=
									areaTotalItem;


							const finalizada =
								finalizadaPorFlag ||
								finalizadaPorArea;


							const emAndamento =
								!finalizada;


							const algumaAreaColhida =
								areaColhidaItem >
								0;


							if (
								checkedColheita
							) {
								return emAndamento;
							}


							if (
								checkedColheitaFinalizada
							) {
								return checkedAlgumaAreaColhida
									? finalizada ||
											algumaAreaColhida
									: finalizada;
							}


							if (
								checkedAlgumaAreaColhida
							) {
								return algumaAreaColhida;
							}


							return (
								data
									.finalizado_colheita !==
								null
							);
						}
					)

					/**
					 * ROMANEIOS
					 */
					.filter(
						(
							data
						) =>
							romaneiosPendente
								? getPendingCount(
										data.id
									) >
									0
								: true
					)

					/**
					 * ÁREA > 0 SEM ROMANEIOS
					 */
					.filter(
						(
							data
						) => {
							if (
								!fAreaParcialGt0SemRomaneios
							) {
								return true;
							}


							const areaParcial =
								Number(
									data
										.area_parcial ||
										0
								);

							const computed =
								getComputedCount(
									data
								);

							const pending =
								getPendingCount(
									data.id
								);


							return (
								areaParcial >
									0 &&
								computed ===
									0 &&
								pending ===
									0
							);
						}
					)

					/**
					 * ÁREA = 0 COM ROMANEIOS
					 */
					.filter(
						(
							data
						) => {
							if (
								!fAreaParcialEq0ComRomaneios
							) {
								return true;
							}


							const areaParcial =
								Number(
									data
										.area_parcial ||
										0
								);

							const computed =
								getComputedCount(
									data
								);

							const pending =
								getPendingCount(
									data.id
								);


							return (
								areaParcial ===
									0 &&
								(
									computed >
										0 ||
									pending >
										0
								)
							);
						}
					);
			},
			[
				selectedFilteredData,

				varieSelect,
				parcelaSelect,

				chekedAreasAvaiable,

				checkedColheita,
				checkedColheitaFinalizada,
				checkedAlgumaAreaColhida,

				romaneiosPendente,

				fAreaParcialGt0SemRomaneios,
				fAreaParcialEq0ComRomaneios,

				idsPending,
			]
		);


	/**
	 * ========================================================
	 * ORDENAÇÃO
	 * ========================================================
	 */

	const sortedFilteredData =
		useMemo(
			() => {
				return [
					...filteredData,
				].sort(
					(
						b,
						a
					) =>
						dateSort
							? String(
									b
										.talhao__id_talhao ||
										""
								).localeCompare(
									String(
										a
											.talhao__id_talhao ||
											""
									),
									"pt-BR",
									{
										numeric:
											true,

										sensitivity:
											"base",
									}
								)
							: Number(
									a.dap ||
										0
								) -
								Number(
									b.dap ||
										0
								)
				);
			},
			[
				filteredData,
				dateSort,
			]
		);


	/**
	 * ========================================================
	 * KPIs
	 * ========================================================
	 */

	useEffect(
		() => {
			let areaTotalSoma =
				0;

			let parcelasTotalCount =
				0;

			let areaColhidaSoma =
				0;

			let areaRealColhida =
				0;

			let pesoTotal =
				0;


			filteredData.forEach(
				(
					data
				) => {
					const areaTotalItem =
						Number(
							data
								.area_colheita ||
								0
						);

					const areaParcialItem =
						Number(
							data
								.area_parcial ||
								0
						);

					const pesoItem =
						Number(
							data
								.peso ||
								0
						);


					areaTotalSoma +=
						areaTotalItem;

					parcelasTotalCount +=
						1;

					areaColhidaSoma +=
						areaParcialItem;

					pesoTotal +=
						pesoItem;


					if (
						pesoItem >
						0
					) {
						areaRealColhida +=
							areaParcialItem;
					}
				}
			);


			const areaDisponivelCalculada =
				areaTotalSoma -
				areaColhidaSoma;


			const produtividade =
				pesoTotal >
					0 &&
				areaColhidaSoma >
					0
					? pesoTotal /
						60 /
						areaColhidaSoma
					: 0;


			const produtividadeReal =
				pesoTotal >
					0 &&
				areaRealColhida >
					0
					? pesoTotal /
						60 /
						areaRealColhida
					: 0;


			const sumRomaneios =
				filteredData
					.map(
						(
							obj
						) =>
							getPendingCount(
								obj.id
							)
					)
					.reduce(
						(
							acc,
							value
						) =>
							acc +
							value,
						0
					);


			const progressBar =
				areaTotalSoma >
				0
					? (
							areaColhidaSoma /
							areaTotalSoma
						) *
						100
					: 0;


			setTotalProdutividadeReal(
				produtividadeReal
			);

			setTotalProdutividade(
				produtividade
			);

			setTotalPesoCarregado(
				pesoTotal
			);

			setAreaTotal(
				formatArea(
					areaTotalSoma
				)
			);

			setParcelasTotal(
				parcelasTotalCount
			);

			setAreaColhidaParcial(
				formatArea(
					areaColhidaSoma
				)
			);

			setAreaColhida(
				formatArea(
					areaColhidaSoma
				)
			);

			setAreaDisponivel(
				formatArea(
					areaDisponivelCalculada
				)
			);

			setTotalRomaneios(
				sumRomaneios
			);

			setAreaTotalProgress(
				progressBar
			);
		},
		[
			filteredData,
		]
	);


	/**
	 * ========================================================
	 * DATA
	 * ========================================================
	 */

	useEffect(
		() => {
			setNewDayNow(
				new Date()
					.toLocaleDateString()
			);
		},
		[]
	);


	/**
	 * ========================================================
	 * TROCA DE FAZENDA
	 * ========================================================
	 */

	useEffect(
		() => {
			setVarieSelect(
				[]
			);

			setParcelaSelect(
				[]
			);
		},
		[
			selectedFarm,
		]
	);


	/**
	 * ========================================================
	 * HANDLERS
	 * ========================================================
	 */

	const handleFilterTable =
		() => {
			setDateSort(
				(
					prev
				) =>
					!prev
			);
		};


	const handleExportData =
		() => {
			exportPlantiosToExcel(
				sortedFilteredData
			);
		};


	const handleChangeCheck =
		(
			event
		) => {
			const checked =
				event.target.checked;


			setCheckedColheita(
				checked
			);


			if (
				checked
			) {
				setCheckedColheitaFinalizada(
					false
				);

				setCheckedAlgumaAreaColhida(
					false
				);
			}
		};


	const handleChangeColheitaFinalizada =
		(
			event
		) => {
			const checked =
				event.target.checked;


			setCheckedColheitaFinalizada(
				checked
			);


			if (
				checked
			) {
				setCheckedColheita(
					false
				);
			}
		};


	const handleChangeAlgumaAreaColhida =
		(
			event
		) => {
			const checked =
				event.target.checked;


			setCheckedAlgumaAreaColhida(
				checked
			);


			if (
				checked
			) {
				setCheckedColheita(
					false
				);
			}
		};


	const handleChangeAreasCheck =
		(
			event
		) => {
			setChekedAreasAvaiable(
				event.target.checked
			);
		};


	const handleChangeRomaneiosPendente =
		(
			event
		) => {
			setRomaneiosPendente(
				event.target.checked
			);
		};


	const handleChangeVarSelect =
		(
			event
		) => {
			const {
				target: {
					value,
				},
			} =
				event;


			setVarieSelect(
				typeof value ===
					"string"
					? value.split(
							","
						)
					: value
			);
		};


	const handleChangeParcelaSelect =
		(
			event
		) => {
			const {
				target: {
					value,
				},
			} =
				event;


			setParcelaSelect(
				typeof value ===
					"string"
					? value.split(
							","
						)
					: value
			);
		};


	const handleChangeFAreaParcialGt0SemRomaneios =
		(
			event
		) => {
			const checked =
				event.target.checked;


			setFAreaParcialGt0SemRomaneios(
				checked
			);


			if (
				checked
			) {
				setFAreaParcialEq0ComRomaneios(
					false
				);
			}
		};


	const handleChangeFAreaParcialEq0ComRomaneios =
		(
			event
		) => {
			const checked =
				event.target.checked;


			setFAreaParcialEq0ComRomaneios(
				checked
			);


			if (
				checked
			) {
				setFAreaParcialGt0SemRomaneios(
					false
				);
			}
		};


	/**
	 * ========================================================
	 * LIMPAR FILTROS
	 * ========================================================
	 */

	const handleClearFilters =
		() => {
			setCheckedColheita(
				true
			);

			setCheckedColheitaFinalizada(
				false
			);

			setCheckedAlgumaAreaColhida(
				false
			);

			setChekedAreasAvaiable(
				false
			);

			setRomaneiosPendente(
				false
			);

			setFAreaParcialGt0SemRomaneios(
				false
			);

			setFAreaParcialEq0ComRomaneios(
				false
			);

			setVarieSelect(
				[]
			);

			setParcelaSelect(
				[]
			);

			setDateSort(
				false
			);
		};


	const hasActiveFilters =
		useMemo(
			() => {
				return (
					!checkedColheita ||
					checkedColheitaFinalizada ||
					checkedAlgumaAreaColhida ||
					chekedAreasAvaiable ||
					romaneiosPendente ||
					fAreaParcialGt0SemRomaneios ||
					fAreaParcialEq0ComRomaneios ||
					varieSelect.length >
						0 ||
					parcelaSelect.length >
						0 ||
					dateSort
				);
			},
			[
				checkedColheita,
				checkedColheitaFinalizada,
				checkedAlgumaAreaColhida,
				chekedAreasAvaiable,
				romaneiosPendente,
				fAreaParcialGt0SemRomaneios,
				fAreaParcialEq0ComRomaneios,
				varieSelect,
				parcelaSelect,
				dateSort,
			]
		);


	/**
	 * ========================================================
	 * SELECT CONFIG
	 * ========================================================
	 */

	const ITEM_HEIGHT =
		48;

	const ITEM_PADDING_TOP =
		8;


	const MenuProps = {
		PaperProps:
			{
				style:
					{
						maxHeight:
							ITEM_HEIGHT *
								6.5 +
							ITEM_PADDING_TOP,

						width:
							280,
					},
			},
	};


	const ParcelaMenuProps =
		{
			PaperProps:
				{
					style:
						{
							maxHeight:
								ITEM_HEIGHT *
									8 +
								ITEM_PADDING_TOP,

							width:
								340,
						},
				},
		};


	const getStyles = (
		name,
		selectedValues,
		themeValue
	) => {
		return {
			fontWeight:
				selectedValues.includes(
					name
				)
					? themeValue
							.typography
							.fontWeightMedium
					: themeValue
							.typography
							.fontWeightRegular,
		};
	};


	/**
	 * ========================================================
	 * RENDER
	 * ========================================================
	 */

	return (
		<Box
			width="100%"
			justifyContent="flex-start"
			alignItems="flex-start"
			display="flex"
			flexDirection="column"
			paddingLeft={
				6
			}
			paddingRight={
				6
			}
			paddingBottom={
				2
			}
			sx={{
				minWidth:
					"1200px",
			}}
		>

			{/* PRINT */}

			<Tooltip title="Salvar imagem da tabela">
				<Fab
					color="success"
					onClick={
						handlePrintTable
					}
					sx={{
						position:
							"fixed",

						right:
							24,

						bottom:
							24,

						zIndex:
							2000,
					}}
				>
					<PhotoCameraIcon />
				</Fab>
			</Tooltip>


			{/* FAZENDAS */}

			<Box
				sx={{
					display:
						"flex",

					flexDirection:
						"row",

					justifyContent:
						"flex-start",

					gap:
						"15px",

					alignItems:
						"flex-start",

					width:
						"100%",

					marginBottom:
						"20px",

					minWidth:
						"1200px",
				}}
			>
				{[
					...(
						filteredFarm ||
						[]
					),
				]
					.sort(
						naturalSort
					)
					.map(
						(
							farm,
							i
						) => (
							<HeaderFarm
								selectedFarm={
									selectedFarm
								}

								farm={
									farm
								}

								key={
									`${farm}-${i}`
								}

								index={
									i
								}

								handlerFilter={
									handlerFilter
								}
							/>
						)
					)}
			</Box>


			<Box
				width="100%"
				ref={
					tableRef
				}
			>

				{/* ==================================================
				    KPIs
				================================================== */}

				<Grid
					container
					spacing={
						2
					}
					sx={{
						mb:
							3,

						minWidth:
							"1200px",

						justifyContent:
							"space-between",
					}}
				>

					<Grid item xs={1.3}>
						<Card
							component={Paper}
							elevation={4}
							sx={{
								backgroundColor:
									colors.primary[900],
							}}
						>
							<CardContent
								sx={{
									paddingBottom:
										"16px !important",
								}}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
								>
									Área Total
								</Typography>

								<Typography
									variant="h6"
									color={
										colors.grey[500]
									}
									fontWeight="bold"
								>
									{areaTotal} Ha
								</Typography>
							</CardContent>
						</Card>
					</Grid>


					<Grid item xs={1.3}>
						<Card
							component={Paper}
							elevation={4}
							sx={{
								backgroundColor:
									colors.primary[900],
							}}
						>
							<CardContent
								sx={{
									paddingBottom:
										"16px !important",
								}}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
								>
									Área Colhida
								</Typography>

								<Typography
									variant="h6"
									color={
										colors.grey[500]
									}
									fontWeight="bold"
								>
									{areaColhida} Ha
								</Typography>
							</CardContent>
						</Card>
					</Grid>


					<Grid item xs={1.5}>
						<Card
							component={Paper}
							elevation={4}
							sx={{
								backgroundColor:
									colors.primary[900],
							}}
						>
							<CardContent
								sx={{
									paddingBottom:
										"16px !important",
								}}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
								>
									Área Disponível
								</Typography>

								<Typography
									variant="h6"
									color={
										colors.grey[500]
									}
									fontWeight="bold"
								>
									{areaDisponivel} Ha
								</Typography>
							</CardContent>
						</Card>
					</Grid>


					<Grid item xs={1.3}>
						<Card
							component={Paper}
							elevation={4}
							sx={{
								backgroundColor:
									colors.primary[900],
							}}
						>
							<CardContent
								sx={{
									paddingBottom:
										"16px !important",
								}}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
								>
									Parcelas
								</Typography>

								<Typography
									variant="h6"
									color={
										colors.grey[500]
									}
									fontWeight="bold"
								>
									{parcelasTotal}
								</Typography>
							</CardContent>
						</Card>
					</Grid>


					<Grid item xs={1.5}>
						<Card
							component={Paper}
							elevation={4}
							sx={{
								backgroundColor:
									colors.primary[900],
							}}
						>
							<CardContent
								sx={{
									paddingBottom:
										"16px !important",
								}}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
								>
									Peso Carregado
								</Typography>

								<Typography
									variant="h6"
									color={
										colors.grey[500]
									}
									fontWeight="bold"
								>
									{formatArea(
										totalPesoCarregado /
											60
									)}{" "}
									Scs
								</Typography>
							</CardContent>
						</Card>
					</Grid>


					<Grid item xs={1.3}>
						<Card
							component={Paper}
							elevation={4}
							sx={{
								backgroundColor:
									colors.primary[900],
							}}
						>
							<CardContent
								sx={{
									paddingBottom:
										"16px !important",
								}}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
								>
									Produtividade
								</Typography>

								<Typography
									variant="h6"
									color={
										colors.grey[500]
									}
									fontWeight="bold"
								>
									{formatArea(
										totalProdutividade
									)}{" "}
									Scs/Ha
								</Typography>
							</CardContent>
						</Card>
					</Grid>


					<Grid item xs={1.8}>
						<Card
							component={Paper}
							elevation={4}
							sx={{
								backgroundColor:
									colors.primary[900],
							}}
						>
							<CardContent
								sx={{
									paddingBottom:
										"16px !important",
								}}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
								>
									Produtividade Real
								</Typography>

								<Typography
									variant="h6"
									color={
										colors.grey[500]
									}
									fontWeight="bold"
								>
									{formatArea(
										totalProdutividadeReal
									)}{" "}
									Scs/Ha
								</Typography>
							</CardContent>
						</Card>
					</Grid>


					<Grid item xs={1.5}>
						<Card
							component={Paper}
							elevation={4}
							sx={{
								backgroundColor:
									colors.primary[900],
							}}
						>
							<CardContent
								sx={{
									paddingBottom:
										"16px !important",

									backgroundColor:
										totalRomaneios >
										0
											? colors.yellow[700]
											: colors.greenAccent[700],

									transition:
										"background-color 0.5s ease",
								}}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
									sx={{
										whiteSpace:
											"nowrap",
									}}
								>
									Romaneios Pendentes
								</Typography>

								<Typography
									variant="h6"
									color={
										colors.grey[500]
									}
									fontWeight="bold"
								>
									{totalRomaneios}
								</Typography>
							</CardContent>
						</Card>
					</Grid>

				</Grid>


				{/* ==================================================
				    FILTROS
				================================================== */}

				<Box
					display="flex"
					justifyContent="space-between"
					width="100%"
					sx={{
						mb:
							0.5,
					}}
				>
					<Box
						sx={{
							display:
								"flex",

							gap:
								"12px",

							alignItems:
								"center",

							flexWrap:
								"nowrap",

							width:
								"100%",
						}}
					>

						{/* ORDENAÇÃO */}

						<FontAwesomeIcon
							icon={
								faArrowDownAZ
							}
							color={
								colors
									.greenAccent[
									500
								]
							}
							size="sm"
							style={{
								cursor:
									"pointer",

								flexShrink:
									0,
							}}
							onClick={
								handleFilterTable
							}
						/>


						{/* EXCEL */}

						<FontAwesomeIcon
							icon={
								faFileExcel
							}
							color={
								colors
									.greenAccent[
									500
								]
							}
							size="lg"
							style={{
								cursor:
									"pointer",

								flexShrink:
									0,
							}}
							onClick={
								handleExportData
							}
						/>


						<FormControlLabel
							control={
								<Switch
									color="secondary"
									size="small"
									checked={
										checkedColheita
									}
									onChange={
										handleChangeCheck
									}
								/>
							}
							label="Colheita Andamento"
							sx={
								switchLabelSx
							}
						/>


						<FormControlLabel
							control={
								<Switch
									color="secondary"
									size="small"
									checked={
										checkedColheitaFinalizada
									}
									onChange={
										handleChangeColheitaFinalizada
									}
								/>
							}
							label="Colheita Finalizada"
							sx={
								switchLabelSx
							}
						/>


						<FormControlLabel
							control={
								<Switch
									color="secondary"
									size="small"
									checked={
										checkedAlgumaAreaColhida
									}
									onChange={
										handleChangeAlgumaAreaColhida
									}
								/>
							}
							label="Alguma área colhida"
							sx={
								switchLabelSx
							}
						/>


						<FormControlLabel
							control={
								<Switch
									color="secondary"
									size="small"
									checked={
										chekedAreasAvaiable
									}
									onChange={
										handleChangeAreasCheck
									}
								/>
							}
							label="Áreas Disponíveis"
							sx={
								switchLabelSx
							}
						/>


						<FormControlLabel
							control={
								<Switch
									color="secondary"
									size="small"
									checked={
										romaneiosPendente
									}
									onChange={
										handleChangeRomaneiosPendente
									}
								/>
							}
							label="Romaneios Pendentes"
							sx={
								switchLabelSx
							}
						/>


						<FormControlLabel
							control={
								<Switch
									color="secondary"
									size="small"
									checked={
										fAreaParcialGt0SemRomaneios
									}
									onChange={
										handleChangeFAreaParcialGt0SemRomaneios
									}
								/>
							}
							label="Área > 0 & sem romaneios"
							sx={{
								...switchLabelSx,

								"& .MuiFormControlLabel-label":
									{
										...switchLabelSx[
											"& .MuiFormControlLabel-label"
										],

										maxWidth:
											"110px",
									},
							}}
						/>


						<FormControlLabel
							control={
								<Switch
									color="secondary"
									size="small"
									checked={
										fAreaParcialEq0ComRomaneios
									}
									onChange={
										handleChangeFAreaParcialEq0ComRomaneios
									}
								/>
							}
							label="Área = 0 & com romaneios"
							sx={{
								...switchLabelSx,

								"& .MuiFormControlLabel-label":
									{
										...switchLabelSx[
											"& .MuiFormControlLabel-label"
										],

										maxWidth:
											"110px",
									},
							}}
						/>


						{/* VARIEDADE */}

						<FormControl
							sx={{
								width:
									220,

								minWidth:
									220,

								flexShrink:
									0,
							}}
							size="small"
						>
							<InputLabel id="variedade-multiple-label">
								Variedade
							</InputLabel>

							<Select
								labelId="variedade-multiple-label"
								id="variedade-multiple"
								multiple
								value={
									varieSelect
								}
								onChange={
									handleChangeVarSelect
								}
								input={
									<OutlinedInput label="Variedade" />
								}
								MenuProps={
									MenuProps
								}
								size="small"
								renderValue={(
									selected
								) =>
									selected.join(
										", "
									)
								}
							>
								{varSelectedArr.map(
									(
										name
									) => (
										<MenuItem
											key={
												name
											}
											value={
												name
											}
											style={getStyles(
												name,
												varieSelect,
												theme
											)}
										>
											{name}
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>


						{/* TALHÃO */}

						<FormControl
							sx={{
								width:
									280,

								minWidth:
									280,

								flexShrink:
									0,
							}}
							size="small"
						>
							<InputLabel id="parcela-multiple-label">
								Talhão - Variedade
							</InputLabel>

							<Select
								labelId="parcela-multiple-label"
								id="parcela-multiple"
								multiple
								value={
									parcelaSelect
								}
								onChange={
									handleChangeParcelaSelect
								}
								input={
									<OutlinedInput label="Talhão - Variedade" />
								}
								MenuProps={
									ParcelaMenuProps
								}
								size="small"
								renderValue={(
									selected
								) =>
									selected
										.map(
											(
												value
											) => {
												const option =
													parcelaOptions.find(
														(
															item
														) =>
															item.value ===
															value
													);

												return (
													option?.label ||
													value
												);
											}
										)
										.join(
											", "
										)
								}
							>
								{parcelaOptions.map(
									(
										option
									) => (
										<MenuItem
											key={
												option.value
											}
											value={
												option.value
											}
											style={getStyles(
												option.value,
												parcelaSelect,
												theme
											)}
										>
											{option.label}
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>


						{/* LIMPAR FILTROS */}

						{hasActiveFilters && (
							<Tooltip
								title="Limpar filtros"
								arrow
							>
								<IconButton
									onClick={
										handleClearFilters
									}
									size="small"
									sx={{
										width:
											34,

										height:
											34,

										flexShrink:
											0,

										color:
											theme.palette.error.main,

										borderRadius:
											"9px",

										backgroundColor:
											theme.palette.mode ===
											"dark"
												? "rgba(244, 67, 54, 0.10)"
												: "rgba(211, 47, 47, 0.07)",

										transition:
											"all 0.18s ease",

										"&:hover":
											{
												backgroundColor:
													theme.palette.mode ===
													"dark"
														? "rgba(244, 67, 54, 0.20)"
														: "rgba(211, 47, 47, 0.14)",

												transform:
													"translateY(-1px)",
											},
									}}
								>
									<FilterAltOffRoundedIcon
										sx={{
											fontSize:
												20,
										}}
									/>
								</IconButton>
							</Tooltip>
						)}
		
					</Box>
					
				</Box>
				{/* DATA COLADA NA BASE DA FAIXA */}

					<Typography
						sx={{
							
							right:
								10,

							bottom:
								10,

							fontSize:
								"0.72rem",

							lineHeight:
								1,

							fontWeight:
								'bold',

							fontStyle:
								"italic",

							color:
								'black',

							pointerEvents:
								"none",
							justifySelf: 'flex-end',
							marginTop: 1,
							marginBottom: 0
						}}
					>
						{newDayNow}
					</Typography>


				{/* ==================================================
				    FAZENDA + DATA
				================================================== */}

				<Box
					sx={{
						position:
							"relative",

						justifySelf:
							"center",

						width:
							"100%",

						mb:
							0.5,

						textAlign:
							"center",

						backgroundColor:
							colors
								.blueOrigin[
								400
							],

						padding:
							"10px",
					}}
				>
					<Typography
						variant="h4"
						color="whitesmoke"
						sx={{
							fontWeight:
								"bold",
						}}
					>
						{selectedFarm?.replace(
							"Projeto",
							""
						)}
					</Typography>


				

				</Box>


				{/* PROGRESSO */}

				<LinearProgressWithLabel
					progress={
						areaTotalProgress
					}
				/>


				{/* TABELA */}

				{sortedFilteredData.length >
					0 && (
					<TableColheita
						theme={
							theme
						}

						colors={
							colors
						}

						idsPending={
							idsPending
						}

						setVarSelectedArr={
							setVarSelectedArr
						}

						setVarieSelect={
							setVarieSelect
						}

						data={
							sortedFilteredData
						}
					/>
				)}

			</Box>
		</Box>
	);
};


export default ColheitaAtual;