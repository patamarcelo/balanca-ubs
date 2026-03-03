import { Box, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import PageData from "./page-data";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoaderPage from "../global/Loader";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";


// 1. Recebendo a prop onClose aqui!
const PrintLayout = ({ data, onClose }) => {
	const isNonMobile = useMediaQuery("(min-width: 1020px)");
	const [printValue, setPrintValue] = useState();
	const [isLoading, setIsLoading] = useState(true);

	const [busy, setBusy] = useState(false);
	const captureRef = useRef(null);

	useEffect(() => {
		setPrintValue(data);
		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	}, [data]);

	const handleDownloadPdf = async () => {
		if (!captureRef.current) return;
		setBusy(true);

		const el = captureRef.current;
		const duplicate = el.querySelector('.print-duplicate');

		try {
			if (document?.fonts?.ready) await document.fonts.ready;
			if (duplicate) duplicate.style.display = 'flex';
			await new Promise((resolve) => setTimeout(resolve, 300));

			const canvas = await html2canvas(el, {
				backgroundColor: "#ffffff",
				scale: 2,
				useCORS: true,
				logging: false,
				width: el.scrollWidth,
				height: el.scrollHeight,
				windowWidth: el.scrollWidth,
				windowHeight: el.scrollHeight,
				scrollY: 0,
				scrollX: 0,
				onclone: (clonedDoc, clonedElement) => {
					const allElements = clonedElement.querySelectorAll('*');
					allElements.forEach((child) => {
						if (child.style.zoom) child.style.zoom = '1';
						if (child.style.transform) child.style.transform = 'none';
						child.style.boxShadow = 'none';
					});
				}
			});

			const imgData = canvas.toDataURL("image/jpeg", 1.0);

			const pdf = new jsPDF({
				orientation: "p",
				unit: "mm",
				format: "a4",
				compress: true,
			});

			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();
			const ratio = canvas.width / canvas.height;

			const margin = 10;
			const maxPdfWidth = pdfWidth - (margin * 2);
			const maxPdfHeight = pdfHeight - (margin * 2);

			let imgWidth = maxPdfWidth;
			let imgHeight = imgWidth / ratio;

			if (imgHeight > maxPdfHeight) {
				imgHeight = maxPdfHeight;
				imgWidth = imgHeight * ratio;
			}

			const x = (pdfWidth - imgWidth) / 2;
			const y = (pdfHeight - imgHeight) / 2;

			pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight, undefined, "FAST");
			pdf.save(`relatorio_${data?.id || 'colheita'}.pdf`);

		} catch (error) {
			console.error("Erro ao gerar PDF:", error);
		} finally {
			if (duplicate) duplicate.style.display = 'none';
			setBusy(false);
		}
	};

	return (
		<Box
			className="print-container"
			display="flex"
			flexDirection="column"
			width="100%"
			sx={{
				height: "100vh", // Trava a altura na tela
				backgroundColor: "#f5f5f5",
				boxSizing: "border-box",
				overflowY: "auto", // A rolagem fica APENAS no contêiner cinza, não na página de trás
				m: 0,
				p: 0
			}}
		>
			{/* BARRA SUPERIOR (Corrigida para não ficar marrom) */}
			<AppBar
				position="sticky"
				elevation={2}
				color="default"
				sx={{
					top: 0,
					zIndex: 1100,
					borderBottom: "1px solid #e0e0e0",
					boxSizing: "border-box"
				}}
			>
				<Toolbar>
					<Typography variant="h6" sx={{ flex: 1, fontWeight: "bold" }}>
						Pré-visualização
					</Typography>

					<Button
						onClick={handleDownloadPdf}
						startIcon={<PictureAsPdfIcon sx={{ color: "white" }} />}
						variant="contained"
						disabled={busy}
						sx={{
							mr: 2,
							color: "white",
							backgroundColor: "#1e88e5",
							"&:hover": { backgroundColor: "#1565c0" },
						}}
					>
						{busy ? "Gerando..." : "Baixar PDF"}
					</Button>

					{/* 2. Botão Fechar executa o onClose que veio do ReportTable */}
					<IconButton edge="end" onClick={onClose} disabled={busy} aria-label="Fechar">
						<CloseIcon sx={{ color: "whitesmoke" }} />
					</IconButton>
				</Toolbar>
			</AppBar>

			{/* ÁREA DE CENTRALIZAÇÃO DO PAPEL */}
			<Box
				display="flex"
				flex={1}
				flexDirection="column"
				justifyContent="flex-start" // Ajustado para não cortar o topo se a tela for muito pequena
				alignItems="center"
				width="100%"
				sx={{ py: 4, px: 2, boxSizing: "border-box" }}
			>
				<Box
					ref={captureRef}
					display="flex"
					flexDirection="column"
					alignItems="center"
					sx={{
						backgroundColor: "white",
						width: isNonMobile ? "90%" : "100%",
						maxWidth: "925px",
						boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Aumentei um tiquinho a sombra pra destacar do fundo cinza
						borderRadius: "8px",
						overflow: "hidden"
					}}
				>
					{/* --- PRIMEIRA VIA --- */}
					<Box display="flex" justifyContent="center" alignItems="center" width="100%">
						{isLoading || !data ? (
							<Box width="100%" height="60vh" display="flex" justifyContent="center" alignItems="center">
								<LoaderPage isLoading={isLoading} />
							</Box>
						) : (
							<PageData data={printValue} via="1ª Via - Empresa" />
						)}
					</Box>

					{/* --- SEGUNDA VIA (ESCONDIDA DA TELA) --- */}
					<Box className="print-duplicate" sx={{ display: "none", width: "100%", flexDirection: "column", alignItems: "center" }}>
						<Box display="flex" alignItems="center" width="100%" sx={{ margin: "30px 0" }}>
							<Typography sx={{ color: "#9e9e9e", fontSize: "20px", mr: 1, ml: 4 }}>✂</Typography>
							<Box sx={{ flex: 1, borderBottom: "2px dashed #9e9e9e", mr: 4 }}></Box>
						</Box>
						<Box display="flex" justifyContent="center" alignItems="center" width="100%">
							{isLoading || !data ? (
								<Box width="100%" height="60vh" display="flex" justifyContent="center" alignItems="center">
									<LoaderPage isLoading={isLoading} />
								</Box>
							) : (
								<PageData data={printValue} via="2ª Via - Motorista" />
							)}
						</Box>
					</Box>

				</Box>
			</Box>
		</Box>
	);
};

export default PrintLayout;