import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import djangoApi from "../../../utils/axios/axios.utils";

import { useEffect } from "react";
import DataDefensivoPage from "../data-table-all";
import DataDefensivoPageByDay from "../data-table-by-day";

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

	const [isTimeLoad, setisTimeLoad] = useState(true);

	const handleProducts = () => {
		setIsOpenProducts(true);
		setisOpenProductsByDay(false);
		setisTimeLoad(true);

		setTimeout(() => {
			setisTimeLoad(false);
		}, 500);
	};
	const handleProductsByDay = () => {
		setIsOpenProducts(false);
		setisOpenProductsByDay(true);
		setisTimeLoad(true);

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
						handleOpenModal={handleProducts}
					/>
					<CustomButton
						color={colors.greenAccent[700]}
						title="Datas"
						handleOpenModal={handleProductsByDay}
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
		</Box>
	);
};

export default HomeDefensivoPage;
