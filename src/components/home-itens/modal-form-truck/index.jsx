import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ModalFormFields from "../modal-form-fields";
import Chip from "@mui/material/Chip";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import toast from "react-hot-toast";

import {
	addTruckMove,
	handleUpdateTruck
} from "../../../utils/firebase/firebase.datatable";
import { useSelector } from "react-redux";
import {
	selectCurrentUser,
	selectUnidadeOpUser
} from "../../../store/user/user.selector";

import { useNavigate } from "react-router-dom";

import { selectTruckLoadsFormatData } from "../../../store/trucks/trucks.selector";

export default function FormDialog(props) {
	const user = useSelector(selectCurrentUser);
	const unidadeOp = useSelector(selectUnidadeOpUser);
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dataTableForm = useSelector(selectTruckLoadsFormatData);

	const filterTableForm = (id, dataTableForm, bruto, liquido, tara) => {
		const newArr = dataTableForm.filter((data) => data.id === id);
		const newArrAded = {
			...newArr[0],
			pesoBruto: bruto,
			liquido: liquido,
			tara: tara
		};
		return newArrAded;
	};

	const navigate = useNavigate();

	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

	const isNumber = (n) => /^-?[\d.]+(?:e-?\d+)?$/.test(n);

	const {
		handleCloseModal,
		isOpenModal,
		dataModal,
		handleCloseModalEsc,
		handleChangeTruck,
		truckValues,
		handleBlurTruck,
		setTruckValues,
		saved,
		handlerSave
	} = props;

	const handleSaveData = async () => {
		const {
			cultura,
			data,
			impureza,
			liquido,
			mercadoria,
			motorista,
			origem,
			pesoBruto,
			placa,
			projeto,
			saida,
			tara,
			tipo,
			umidade,
			observacoes,
			destino
		} = truckValues;
		setIsLoadingSubmit(true);
		try {
			const newTrans = await addTruckMove(
				user.email,
				data,
				pesoBruto,
				tara,
				liquido,
				cultura,
				placa,
				umidade,
				mercadoria,
				origem,
				impureza,
				projeto,
				motorista,
				saida,
				tipo,
				observacoes,
				destino,
				unidadeOp
			);
			toast.success("Carga registrada com sucesso!!");
			if (newTrans) {
				handleCloseModal();
				handlerSave(saved + 1);
			}
		} catch (error) {
			console.log("erro ao salvar a transação");
		} finally {
			setIsLoadingSubmit(false);
		}
	};

	const handlerNavigatePrint = (data) => {
		navigate("/print", { state: { data: data } });
	};

	const handleEditCarga = async (event) => {
		setIsLoadingSubmit(true);
		try {
			const newTransData = {
				...truckValues,
				userSaida: user.email
			};
			await handleUpdateTruck(event, truckValues.id, newTransData);
			toast.success("Carga alterada com sucesso!!");
			handleCloseModal();
			handlerSave(saved + 1);
			handlerNavigatePrint(
				filterTableForm(
					truckValues.id,
					dataTableForm,
					truckValues.pesoBruto,
					truckValues.liquido,
					truckValues.tara
				)
			);
		} catch (error) {
			console.log("erro ao editar a transação", error);
		} finally {
			setIsLoadingSubmit(false);
		}
	};

	return (
		<div>
			<Dialog
				open={isOpenModal}
				onClose={handleCloseModalEsc}
				sx={{
					"& .MuiPaper-root": {
						minWidth: "60vw !important"
					},
					"& .MuiChip-root": {
						borderRadius: 1
					},
					"& .MuiDialogTitle-root , .MuiDialogActions-spacing": {
						backgroundColor: colors.modal[700]
					}
				}}
			>
				<DialogTitle>
					<Chip
						label={dataModal.title}
						color={dataModal.color}
						size="small"
						sx={{
							fontWeight: "bold",
							fontSize: "14px",
							color: "white",
							"& .MuiChip-label": {
								textTransform: "uppercase"
							}
						}}
					/>
				</DialogTitle>
				<DialogContent
					sx={{
						padding: "20px",
						paddingTop: "20px !important"
						// backgroundColor: "red !important"
					}}
				>
					<ModalFormFields
						handleChangeTruck={handleChangeTruck}
						truckValues={truckValues}
						handleBlurTruck={handleBlurTruck}
						setTruckValues={setTruckValues}
					/>
				</DialogContent>
				<DialogActions
					sx={{
						paddingTop: "20px"
					}}
				>
					<Button
						size="small"
						color="warning"
						onClick={handleCloseModal}
						sx={{
							backgroundColor: colors.yellow[700],
							color: "white"
						}}
					>
						Cancelar
					</Button>

					{dataModal.title === "Editar Carga" ? (
						<LoadingButton
							size="small"
							loading={isLoadingSubmit}
							onClick={handleEditCarga}
							disabled={
								truckValues.liquido < 1 ||
								!isNumber(truckValues.liquido)
							}
							sx={{
								backgroundColor: colors.greenAccent[600],
								color: "white"
							}}
						>
							Registrar Saída
						</LoadingButton>
					) : (
						<LoadingButton
							size="small"
							onClick={handleSaveData}
							loading={isLoadingSubmit}
							variant="outlined"
							sx={{
								backgroundColor: colors.greenAccent[600],
								color: "white"
							}}
							disabled={
								(dataModal.title === "Descarregando" &&
									truckValues.pesoBruto < 1) ||
								(dataModal.title === "Carregando" &&
									truckValues.tara < 1)
							}
						>
							Registrar Entrada
						</LoadingButton>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
}
