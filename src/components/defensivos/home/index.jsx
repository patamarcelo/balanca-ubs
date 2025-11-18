import { Box, useTheme, Slide } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";

import { useEffect } from "react";
import DataDefensivoPage from "../data-table-all";
import DataDefensivoPageDinamic from "../data-table-dinamic";
import DataProgramPage from "../data-program";
import PlantioDonePage from "../plantio-done";
import ProdutividadePage from "../produtividade-page";
import FarmBoxPage from "../farmbox-data";
import ProgramasSection from "../programas/Index";
import InsumosProtFarm from "../insumos-prot-farm";
import InsumosBioPage from "../insumosBio";

import Stack from "@mui/material/Stack";
import CustomButton from "../../button";

import LoaderHomeSkeleton from "./loader";

import DateIntervalPage from "../data-program/date-interval";

import classes from "../data-program/data-program.module.css";
import classesPlantioDone from "../plantio-done/plantio-done-page.module.css";
import { useSelector } from "react-redux";

import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";



const HomeDefensivoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const { isLoadingHome, handleRefreshData } = props;

	const [isOpenProducts, setIsOpenProducts] = useState(false);
	const [isOpenProductsByDayDinamic, setisOpenProductsByDayDinamic] =
		useState(false);
	const [isOpenProductsProgram, setisOpenProductsProgram] = useState(true);
	const [isOpenPlantioPage, setIsOpenPlantioPage] = useState(false);
	const [isOpenFarmbox, setIsOpenFarmbox] = useState(false);

	const [isChangingTable, setIsChangingTable] = useState(false);
	const [isProdutividadePage, setIsProdutividadePage] = useState(false);
	const [insumosProtFarm, setInsumosProtFarm] = useState(false);
	const [insumosBio, setInsumosBio] = useState(false);

	const [programasOpen, setProgramasOpen] = useState(false);

	const [initialDateForm, setInitialDate] = useState(null);
	const [finalDateForm, setFinalDateForm] = useState(null);

	const [checked, setChecked] = useState(false);


	const visible = useSelector((state) => state.ui.headerVisible);

	useEffect(() => {
		const today = new Date();
		const lastSunday = (today) => {
			var t = new Date(today);
			t.setDate(t.getDate() - t.getDay());
			return [t.toISOString().slice(0, 10), t];
		};
		// setInitialDate(lastSunday(today)[0]);
		setInitialDate("2023-05-01");
		const finalDate = lastSunday(today)[1];
		finalDate.setDate(finalDate.getDate() + 6);
		setFinalDateForm(finalDate.toISOString().split("T")[0]);
	}, []);


	const dictComps = {
		dinamic: "dinamic",
		table: "table",
		tableByDay: "tableByDay",
		productsProgram: "productsProgram",
		plantioPage: "plantioPage",
		produtividadePage: "produtividadePage",
		farmboxData: "farmbox",
		programas: "programas",
		insumosProtFarm: 'insumosProtFarm',
		insumosBio: 'insumosBio',
	};

	const handleSelectComponent = (name) => {
		setIsChangingTable(true);
		switch (name) {
			case "dinamic":
				setisOpenProductsByDayDinamic(true);
				setIsOpenFarmbox(false);
				setIsOpenProducts(false);
				setisOpenProductsProgram(false);
				setIsOpenPlantioPage(false);
				setIsProdutividadePage(false);
				setProgramasOpen(false);
				setInsumosProtFarm(false);
				setInsumosBio(false)
				break;
			case "table":
				setIsOpenProducts(true);
				setisOpenProductsByDayDinamic(false);
				setIsOpenFarmbox(false);
				setisOpenProductsProgram(false);
				setIsOpenPlantioPage(false);
				setIsProdutividadePage(false);
				setProgramasOpen(false);
				setInsumosProtFarm(false);
				setInsumosBio(false)
				break;
			case "productsProgram":
				setisOpenProductsProgram(true);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsOpenFarmbox(false);
				setIsOpenPlantioPage(false);
				setIsProdutividadePage(false);
				setProgramasOpen(false);
				setInsumosProtFarm(false);
				setInsumosBio(false)
				break;
			case "plantioPage":
				setIsOpenPlantioPage(true);
				setisOpenProductsProgram(false);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsOpenFarmbox(false);
				setIsProdutividadePage(false);
				setProgramasOpen(false);
				setInsumosProtFarm(false);
				setInsumosBio(false)
				break;
			case "produtividadePage":
				setIsProdutividadePage(true);
				setIsOpenPlantioPage(false);
				setisOpenProductsProgram(false);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsOpenFarmbox(false);
				setProgramasOpen(false);
				setInsumosProtFarm(false);
				setInsumosBio(false)
				break;
			case "farmbox":
				setIsOpenFarmbox(true);
				setIsOpenPlantioPage(false);
				setisOpenProductsProgram(false);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsProdutividadePage(false);
				setProgramasOpen(false);
				setInsumosProtFarm(false);
				setInsumosBio(false)
				break;
			case "programas":
				setProgramasOpen(true);
				setIsOpenFarmbox(false);
				setIsOpenPlantioPage(false);
				setisOpenProductsProgram(false);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsProdutividadePage(false);
				setInsumosProtFarm(false);
				setInsumosBio(false)
				break;
			case "insumosProtFarm":
				setInsumosProtFarm(true);
				setProgramasOpen(false);
				setIsOpenFarmbox(false);
				setIsOpenPlantioPage(false);
				setisOpenProductsProgram(false);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsProdutividadePage(false);
				setInsumosBio(false)
				break;
			case "insumosBio":
				setInsumosBio(true)
				setInsumosProtFarm(false);
				setProgramasOpen(false);
				setIsOpenFarmbox(false);
				setIsOpenPlantioPage(false);
				setisOpenProductsProgram(false);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsProdutividadePage(false);
				break;
			default:
				console.log("sem nenhum selecionado");
		}

		setTimeout(() => {
			setIsChangingTable(false);
		}, 500);
	};

	const buttonTable = [
		{
			title: "Programação",
			option: dictComps.table,
			selection: isOpenProducts
		},
		{
			title: "Aplicações",
			option: dictComps.productsProgram,
			selection: isOpenProductsProgram
		},
		{
			title: "AP Detalhado",
			option: dictComps.dinamic,
			selection: isOpenProductsByDayDinamic
		},
		{
			title: "Plantio",
			option: dictComps.plantioPage,
			selection: isOpenPlantioPage
		},
		{
			title: "Produtividade",
			option: dictComps.produtividadePage,
			selection: isProdutividadePage
		},
		{
			title: "Farmbox",
			option: dictComps.farmboxData,
			selection: isOpenFarmbox
		},
		{
			title: "Programas",
			option: dictComps.programas,
			selection: programasOpen
		},
		{
			title: "Insumos PxF",
			option: dictComps.insumosProtFarm,
			selection: insumosProtFarm
		},
		{
			title: "Biológicos",
			option: dictComps.insumosBio,
			selection: insumosBio
		}
	];

	const STATUS_COMP = [
		{
			status: isOpenProducts,
			comp: <DataDefensivoPage isLoadingHome={isLoadingHome} />
		},
		{
			status: isOpenProductsByDayDinamic,
			comp: <DataDefensivoPageDinamic isLoadingHome={isLoadingHome} />
		},
		{
			status: isOpenProductsProgram,
			comp: (
				<DataProgramPage
					handleRefreshData={handleRefreshData}
					initialDateForm={initialDateForm}
					finalDateForm={finalDateForm}
					isLoadingHome={isLoadingHome}
				/>
			)
		},
		{
			status: isOpenPlantioPage,
			comp: <PlantioDonePage isLoadingHome={isLoadingHome} />
		},
		{
			status: isProdutividadePage,
			comp: <ProdutividadePage isLoadingHome={isLoadingHome} useMulti={checked} />
		},
		{
			status: isOpenFarmbox,
			comp: <FarmBoxPage isLoadingHome={isLoadingHome} />
		},
		{
			status: programasOpen,
			comp: <ProgramasSection isLoadingHome={isLoadingHome} />
		},
		{
			status: insumosProtFarm,
			comp: <InsumosProtFarm isLoadingHome={isLoadingHome} />
		},
		{
			status: insumosBio,
			comp: <InsumosBioPage isLoadingHome={isLoadingHome} />
		}
	];

	const handleChange = (event) => {
		const value = event.target.checked;
		setChecked(value);
	};

	return (
		<Box width="100%" height="100%" mt={!visible && 2} alignItems={"center"}>
			<Box sx={{ marginLeft: "5px" }} mb={2}>
				<Stack spacing={2} direction="row" justifyContent="start">
					<Box
						display="flex"
						justifyContent="start"
						gap="20px"
						height="42px"
						alignItems="end"
					>
						{buttonTable.map((data, i) => {
							return (
								<CustomButton
									size="small"
									height="30px"
									key={i}
									color={
										data.selection
											? colors.greenAccent[900]
											: colors.greenAccent[600]
									}
									fontColor={colors.primary[100]}
									title={data.title}
									handleOpenModal={() =>
										handleSelectComponent(data.option)
									}
								/>
							);
						})}
						<Tooltip title="Possibilidade de filtrar mais de 1 ciclo na Produtividade" arrow>
							<FormControlLabel
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									".MuiFormControlLabel-label": {
										fontWeight: 600,
										color: checked ? "#2e7d32" : "#555",
									},
								}}
								control={
									<Switch
										checked={checked}
										onChange={handleChange}
										color="success"
									/>
								}
								label={checked ? "Multi" : "Single"}
							/>
						</Tooltip>
					</Box>
					{isOpenProductsProgram && (
						<Box
							sx={{
								flexGrow: 1,
								display: "flex",
								justifyContent: "center",
								margin: "5px",
							}}
						>
							<div className={classes["date-picker"]}>
								<DateIntervalPage
									setInitialDate={setInitialDate}
									initialDateForm={initialDateForm}
									label="Data Inicial"
								/>
								<DateIntervalPage
									setInitialDate={setFinalDateForm}
									initialDateForm={finalDateForm}
									label="Data Final"
								/>
							</div>
						</Box>
					)}
				</Stack>
			</Box>
			{/* {isOpenProducts && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<DataDefensivoPage isLoadingHome={isLoadingHome} />
					)}
				</>
			)}
			{isOpenProductsByDayDinamic && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<DataDefensivoPageDinamic
							isLoadingHome={isLoadingHome}
						/>
					)}
				</>
			)}
			{isOpenProductsProgram && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<DataProgramPage
							handleRefreshData={handleRefreshData}
							initialDateForm={initialDateForm}
							finalDateForm={finalDateForm}
							isLoadingHome={isLoadingHome}
						/>
					)}
				</>
			)}
			{isOpenPlantioPage && (
				<>
					{isChangingTable && (
						<Box className={classesPlantioDone.container}>
							<LoaderHomeSkeleton />
						</Box>
					)}
					{!isLoadingHome && !isChangingTable && (
						<PlantioDonePage isLoadingHome={isLoadingHome} />
					)}
				</>
			)}
			{isProdutividadePage && (
				<>
					{isChangingTable && (
						<Box className={classesPlantioDone.container}>
							<LoaderHomeSkeleton />
						</Box>
					)}
					{!isLoadingHome && !isChangingTable && (
						<ProdutividadePage isLoadingHome={isLoadingHome} />
					)}
				</>
			)}
			{isOpenFarmbox && (
				<>
					{isChangingTable && (
						<Box className={classesPlantioDone.container}>
							<LoaderHomeSkeleton />
						</Box>
					)}
					{!isLoadingHome && !isChangingTable && (
						<FarmBoxPage isLoadingHome={isLoadingHome} />
					)}
				</>
			)}
			{programasOpen && (
				<>
					{isChangingTable && (
						<Box className={classesPlantioDone.container}>
							<LoaderHomeSkeleton />
						</Box>
					)}
					{!isLoadingHome && !isChangingTable && (
						<ProgramasSection isLoadingHome={isLoadingHome} />
					)}
				</>
			)} */}

			{STATUS_COMP.map((data, i) => {
				return (
					data.status && (
						<>
							{isChangingTable && (
								<Box className={classesPlantioDone.container} key={i}>
									<LoaderHomeSkeleton />
								</Box>
							)}
							{!isLoadingHome && !isChangingTable && data.comp}
						</>
					)
				);
			})}
		</Box>
	);
};

export default HomeDefensivoPage;
