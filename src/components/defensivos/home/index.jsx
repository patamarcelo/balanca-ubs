import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import djangoApi from "../../../utils/axios/axios.utils";

import { useEffect } from "react";
import DataDefensivoPage from "../data-table-all";
import DataDefensivoPageByDay from "../data-table-by-day";
import DataDefensivoPageDinamic from "../data-table-dinamic";

import Stack from "@mui/material/Stack";
import CustomButton from "../../button";

import Skeleton from "@mui/material/Skeleton";

const HomeDefensivoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isOpen, setIsOpen] = useState(false);
	const [dataDef, setDataDef] = useState([]);
	const [resumeData, setResumeDate] = useState([]);
	const { isLoadingHome } = props;

	const [isOpenProducts, setIsOpenProducts] = useState(false);
	const [isOpenProductsByDay, setisOpenProductsByDay] = useState(true);
	const [isOpenProductsByDayDinamic, setisOpenProductsByDayDinamic] =
		useState(false);

	const [isTimeLoad, setisTimeLoad] = useState(true);

	const dictComps = {
		dinamic: "dinamic",
		table: "table",
		tableByDay: "tableByDay"
	};

	const handleSelectComponent = (name) => {
		console.log("name to active: ", name);
		setisTimeLoad(true);
		switch (name) {
			case "dinamic":
				setisOpenProductsByDayDinamic(true);
				setisOpenProductsByDay(false);
				setIsOpenProducts(false);
				break;
			case "tableByDay":
				setisOpenProductsByDay(true);
				setisOpenProductsByDayDinamic(false);
				setIsOpenProducts(false);
				break;
			case "table":
				setIsOpenProducts(true);
				setisOpenProductsByDay(false);
				setisOpenProductsByDayDinamic(false);
				break;
			default:
				console.log("sem nenhum selecionado");
		}

		setTimeout(() => {
			setisTimeLoad(false);
		}, 500);
	};

	useEffect(() => {
		djangoApi
			.get("plantio/get_plantio_operacoes_detail/", {
				headers: {
					Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
				}
			})
			.then((res) => {
				// console.log(res.data);
				setDataDef(res.data.dados);
				setResumeDate(res.data.app_date);
			})
			.catch((err) => console.log(err));

		setTimeout(() => {
			setisTimeLoad(false);
		}, 1000);
	}, []);

	return (
		<Box width="100%" height="100%">
			{/* <Typography variant="h2" color={colors.blueAccent[700]}>
				Pagina dos defensivos
			</Typography> */}
			<Box>
				<Stack spacing={2} direction="row">
					<CustomButton
						color={colors.greenAccent[700]}
						title="Produtos"
						handleOpenModal={() =>
							handleSelectComponent(dictComps.table)
						}
					/>
					<CustomButton
						color={colors.greenAccent[700]}
						title="Datas"
						handleOpenModal={() =>
							handleSelectComponent(dictComps.tableByDay)
						}
					/>
					<CustomButton
						color={colors.greenAccent[700]}
						title="Dinamica"
						handleOpenModal={() =>
							handleSelectComponent(dictComps.dinamic)
						}
					/>
				</Stack>
			</Box>
			{isOpenProducts && (
				<>
					{isTimeLoad && (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							width="100%"
							height="100%"
							mt={2}
							sx={{
								backgroundColor: colors.blueOrigin[700],
								borderRadius: "8px",
								boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
							}}
						>
							<Box
								sx={{
									width: "100%",
									height: "100%",
									padding: "20px"
								}}
							>
								<Typography variant="h1">
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
								</Typography>
							</Box>
						</Box>
					)}
					{!isTimeLoad && (
						<DataDefensivoPage
							isLoadingHome={isLoadingHome}
							data={dataDef}
						/>
					)}
				</>
			)}
			{isOpenProductsByDay && (
				<>
					{isTimeLoad && (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							width="100%"
							height="100%"
							mt={2}
							sx={{
								backgroundColor: colors.blueOrigin[700],
								borderRadius: "8px",
								boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
							}}
						>
							<Box
								sx={{
									width: "100%",
									height: "100%",
									padding: "20px"
								}}
							>
								<Typography variant="h1">
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
								</Typography>
							</Box>
						</Box>
					)}
					{!isTimeLoad && (
						<DataDefensivoPageByDay
							isLoadingHome={isLoadingHome}
							resumeData={resumeData}
						/>
					)}
				</>
			)}
			{isOpenProductsByDayDinamic && (
				<>
					{isTimeLoad && (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							width="100%"
							height="100%"
							mt={2}
							sx={{
								backgroundColor: colors.blueOrigin[700],
								borderRadius: "8px",
								boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
							}}
						>
							<Box
								sx={{
									width: "100%",
									height: "100%",
									padding: "20px"
								}}
							>
								<Typography variant="h1">
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
								</Typography>
							</Box>
						</Box>
					)}
					{!isTimeLoad && (
						<DataDefensivoPageDinamic
							isLoadingHome={isLoadingHome}
							dataDef={dataDef}
						/>
					)}
				</>
			)}
		</Box>
	);
};

export default HomeDefensivoPage;
