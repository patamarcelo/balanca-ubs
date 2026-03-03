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

// Importando as bibliotecas de PDF
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PrintLayout = ({ data, onClose }) => {
	const isNonMobile = useMediaQuery("(min-width: 1020px)");
	const [printValue, setPrintValue] = useState();
	const [isLoading, setIsLoading] = useState(true);

	// Estados e Refs para a geração do PDF
	const [busy, setBusy] = useState(false);
	const captureRef = useRef(null);

	useEffect(() => {
		setPrintValue(data);
		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	}, [data]);

	// A nossa função mágica de gerar o PDF com as duas vias
	// A nossa função mágica de gerar o PDF com as duas vias (Agora centralizado em A4)
	const handleDownloadPdf = async () => {
		if (!captureRef.current) return;
		setBusy(true);

		const el = captureRef.current;
		const duplicate = el.querySelector('.print-duplicate');

		try {
			if (document?.fonts?.ready) {
				await document.fonts.ready;
			}

			// 1. Revela a segunda via
			if (duplicate) duplicate.style.display = 'flex';

			// 2. Dá um tempo pro DOM recalcular a altura
			await new Promise((resolve) => setTimeout(resolve, 300));

			// 3. Tira a foto
			const canvas = await html2canvas(el, {
				backgroundColor: "#ffffff",
				scale: 2,
				useCORS: true,
				logging: false,
				width: el.scrollWidth,
				height: el.scrollHeight,
				windowWidth: el.scrollWidth,
				windowHeight: el.scrollHeight,
				scrollY: 0, // <--- ADICIONE ESTA LINHA
				scrollX: 0, // <--- ADICIONE ESTA LINHA
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

			// --- MÁGICA NOVA: Criando um PDF A4 padrão ---
			const pdf = new jsPDF({
				orientation: "p", // Retrato (portrait)
				unit: "mm",       // Milímetros para facilitar o cálculo
				format: "a4",     // Força o formato A4 (folha sulfite)
				compress: true,
			});

			// Pegando as dimensões exatas da folha A4 em milímetros
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			// Calculando a proporção da imagem gerada pelo html2canvas
			const canvasWidth = canvas.width;
			const canvasHeight = canvas.height;
			const ratio = canvasWidth / canvasHeight;

			// Definindo margens de segurança (ex: 10mm de borda na folha)
			const margin = 10;
			const maxPdfWidth = pdfWidth - (margin * 2);
			const maxPdfHeight = pdfHeight - (margin * 2);

			// Calculando a largura e altura finais para caber na folha sem distorcer
			let imgWidth = maxPdfWidth;
			let imgHeight = imgWidth / ratio;

			// Se, por acaso, a altura passar do limite da folha, ajustamos pela altura
			if (imgHeight > maxPdfHeight) {
				imgHeight = maxPdfHeight;
				imgWidth = imgHeight * ratio;
			}

			// Calculando o eixo X e Y exatos para centralizar vertical e horizontalmente
			const x = (pdfWidth - imgWidth) / 2;
			const y = (pdfHeight - imgHeight) / 2;

			// Colando a imagem no PDF exatamente no centro!
			pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight, undefined, "FAST");
			pdf.save(`relatorio_${data?.id || 'colheita'}.pdf`);

		} catch (error) {
			console.error("Erro ao gerar PDF:", error);
		} finally {
			// 4. Esconde a segunda via novamente
			if (duplicate) duplicate.style.display = 'none';
			setBusy(false);
		}
	};

	return (
		<Box
			className="print-container"
			display="flex"
			flexDirection="column"
			justifyContent="center" // Centraliza verticalmente
			alignItems="center"     // Centraliza horizontalmente
			width="100%"
			sx={{
				minHeight: "100vh", // Garante que ocupe a tela toda para alinhar ao meio
				pb: 4,
				pt: 10,             // Compensa o espaço da AppBar fixa
				px: 2,
				backgroundColor: "#f5f5f5" // Fundo cinza para dar destaque ao relatório
			}}
		>
			{/* BARRA SUPERIOR (Fica de fora do PDF) */}
			<AppBar
				position="fixed"
				color="primary"
				elevation={1}
				sx={{
					backgroundColor: "background.paper",
					borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
				}}
			>
				<Toolbar>
					<Typography variant="h6" sx={{ flex: 1, color: "text.primary" }}>
						Pré-visualização
					</Typography>

					{/* Botão agora chama a função de PDF */}
					<Button
						onClick={handleDownloadPdf}
						startIcon={<PictureAsPdfIcon sx={{ color: "white" }} />}
						variant="contained"
						disabled={busy}
						sx={{
							mr: 1,
							color: "white",
							backgroundColor: "#1e88e5",
							"&:hover": { backgroundColor: "#1565c0" },
						}}
					>
						{busy ? "Gerando..." : "Baixar PDF"}
					</Button>

					{/* Botão de fechar chama o onClose */}
					<IconButton edge="end" onClick={onClose} disabled={busy} aria-label="Fechar">
						<CloseIcon />
					</IconButton>
				</Toolbar>
			</AppBar>

			{/* ÁREA DE CAPTURA DO PDF (Ref colocada aqui) */}
			{/* Este é o "Papel" com a sombra que o usuário enxerga */}
			<Box
				ref={captureRef}
				display="flex"
				flexDirection="column"
				alignItems="center"
				sx={{
					backgroundColor: "white",
					width: isNonMobile ? "90%" : "100%",
					maxWidth: "925px",
					// py: 2, // <--- TROQUE pb: 2 POR py: 2 AQUI!
					// border: "1px solid #e0e0e0",
					boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
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

					{/* LINHA DE CORTE */}
					<Box display="flex" alignItems="center" width="100%" sx={{ margin: "30px 0" }}>
						<Typography sx={{ color: "#9e9e9e", fontSize: "20px", mr: 1, ml: 4 }}>✂</Typography>
						<Box sx={{ flex: 1, borderBottom: "2px dashed #9e9e9e", mr: 4 }}></Box>
					</Box>

					{/* O FORMULÁRIO DA SEGUNDA VIA */}
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
	);
};

export default PrintLayout;