import React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import Box from "@mui/material/Box";

export default function PreviewPrintDialog({ open, onClose, title = "Pré-visualização", children }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen
            PaperProps={{
                sx: {
                    width: "100%",
                    height: "100%",
                    margin: 0,
                    maxWidth: "100%",
                    maxHeight: "100%",
                },
            }}
        >
            {/* AppBar fixa */}
            <AppBar
                position="fixed"
                color="default"
                elevation={1}
                sx={(theme) => ({
                    backgroundColor: theme.palette.background.paper,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                })}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flex: 1 }}>{title}</Typography>

                    <Button
                        onClick={() => window.print()}
                        startIcon={<PrintIcon sx={{ color: "inherit" }} />}
                        variant="contained"
                        sx={{
                            mr: 1,
                            color: "white",
                            backgroundColor: "#1e88e5",
                            "&:hover": { backgroundColor: "#1565c0" },
                        }}
                    >
                        Imprimir
                    </Button>

                    <IconButton edge="end" onClick={onClose} aria-label="Fechar">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Spacer para o conteúdo não ficar sob a AppBar */}
            <Toolbar />

            {/* Área rolável/centralizada para o conteúdo de impressão */}
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "auto",
                }}
            >
                {children}
            </Box>
        </Dialog>
    );
}
