import React, { useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// Importar ícone de imagem caso queira um botão separado para imagem
import ImageIcon from "@mui/icons-material/Image";
import Box from "@mui/material/Box";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PreviewPdfModal({
    open,
    onClose,
    title = "Pré-visualização",
    children,
    fileName = "relatorio.pdf",
}) {
    const [busy, setBusy] = useState(false);

    // Agora apontamos a referência para um contêiner INTERNO, sem overflow
    const captureRef = useRef(null);

    // Função para baixar o PDF
    const handleDownloadPdfFromScreen = async () => {
        if (!captureRef.current) return;
        setBusy(true);

        try {
            if (document?.fonts?.ready) {
                await document.fonts.ready;
            }

            const el = captureRef.current;
            

            const canvas = await html2canvas(el, {
                backgroundColor: "#ffffff",
                scale: 2,
                useCORS: true,
                logging: false,
                width: el.scrollWidth,
                height: el.scrollHeight,
                windowWidth: el.scrollWidth,
                windowHeight: el.scrollHeight,
                // O onclone roda em uma cópia invisível do DOM antes de gerar a imagem
                onclone: (clonedDoc, clonedElement) => {
                    // Seleciona TODOS os elementos dentro do seu relatório
                    const allElements = clonedElement.querySelectorAll('*');
                    
                    allElements.forEach((child) => {
                        // Força a remoção de espaçamentos calculados erroneamente pelo MUI
                        child.style.letterSpacing = '0px'; 
                        child.style.wordSpacing = 'normal';
                        child.style.fontVariantLigatures = 'none';
                        child.style.textRendering = 'geometricPrecision';
                        
                        // Se houver problemas com text-transform, você pode até forçar a remoção aqui:
                        // child.style.textTransform = 'none';
                    });
                }
            });

            // Qualidade 1.0 para manter fidelidade
            const imgData = canvas.toDataURL("image/jpeg", 1.0);

            // Calcula o PDF em pixels para bater exatamente com a imagem gerada
            const pdf = new jsPDF({
                orientation: canvas.width >= canvas.height ? "l" : "p",
                unit: "px",
                format: [canvas.width, canvas.height],
                compress: true,
            });

            pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
            pdf.save(fileName);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
        } finally {
            setBusy(false);
        }
    };

    // Função extra: Como você mencionou "baixar a imagem", adicionei 
    // essa função caso você queira exportar apenas como PNG em vez de PDF.
    const handleDownloadImage = async () => {
        if (!captureRef.current) return;
        setBusy(true);

        try {
            if (document?.fonts?.ready) await document.fonts.ready;

            const el = captureRef.current;
            const canvas = await html2canvas(el, {
                backgroundColor: "#ffffff",
                scale: 2,
                useCORS: true,
                logging: false,
                width: el.scrollWidth,
                height: el.scrollHeight,
                windowWidth: el.scrollWidth,
                windowHeight: el.scrollHeight,
            });

            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = fileName.replace(".pdf", ".png");
            link.href = imgData;
            link.click();

        } catch (error) {
            console.error("Erro ao gerar imagem:", error);
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal open={open} onClose={busy ? undefined : onClose} disableScrollLock>
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    outline: "none",
                }}
            >
                <AppBar position="sticky" color="default" elevation={1}>
                    <Toolbar sx={{ gap: 1 }}>
                        <Typography variant="h6" sx={{ flex: 1 }} noWrap>
                            {title}
                        </Typography>

                        {/* Botão para imagem (opcional) */}
                        <Button
                            onClick={handleDownloadImage}
                            startIcon={<ImageIcon />}
                            variant="outlined"
                            disabled={busy}
                        >
                            Baixar Imagem
                        </Button>

                        {/* Botão para PDF */}
                        <Button
                            onClick={handleDownloadPdfFromScreen}
                            startIcon={<PictureAsPdfIcon />}
                            variant="contained"
                            color="info"
                            disabled={busy}
                        >
                            {busy ? "Gerando..." : "Baixar PDF"}
                        </Button>

                        <IconButton edge="end" onClick={onClose} disabled={busy} aria-label="Fechar">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Box sx={{ flex: 1, overflow: "hidden", display: "flex", justifyContent: "center", bgcolor: "#f5f5f5" }}>
                    {/* CONTÊINER EXTERNO: Lida com o Scroll */}
                    <Box
                        sx={{
                            width: "100%",
                            overflow: "auto", // O scroll fica APENAS aqui
                            // p: 2,
                        }}
                    >
                        {/* CONTÊINER INTERNO: Alvo do html2canvas */}
                        {/* Ele não tem overflow, ele cresce o quanto for necessário de altura */}
                        <div
                            ref={captureRef}
                            style={{
                                backgroundColor: "#ffffff",
                                width: "100%",
                                minHeight: "100%",
                                height: "max-content",
                                padding: "16px",
                                boxSizing: "border-box",
                                // --- ADICIONE ESTAS TRÊS LINHAS ---
                                fontVariantLigatures: "none",
                                letterSpacing: "normal",
                                textRendering: "geometricPrecision"
                            }}
                        >
                            {children}
                        </div>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}