import React, { useState, useRef } from "react";
import {
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    Slide,
    Button,
    Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import PlaylistRemoveRoundedIcon from "@mui/icons-material/PlaylistRemoveRounded";

const SelectCulturaVariedade = ({
    culturaSelecionada,
    setCulturaSelecionada,
    variedadeSelecionada,
    setVariedadeSelecionada,
    culturas,
    variedades,
    parcelas,
    parcelaSelecionada,
    setParcelaSelecionada,
    openMontarCalda,
    caldaAvulsa,
    handleClearCaldaAvulsa,
    // NOVO:
    estagios = [],
    estagioSelecionado = [],
    setEstagioSelecionado = () => { },
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const containerRef = useRef(null);

    const variedadesFiltradas = variedades.filter((v) =>
        culturaSelecionada.includes(v.cultura)
    );

    const nomesVariedadesSelecionadas = variedadesFiltradas
        .filter((v) => variedadeSelecionada.includes(v.id))
        .map((v) => v.nome);

    const parcelasFiltradas = parcelas.filter(
        (p) =>
            (culturaSelecionada.length === 0 ||
                culturaSelecionada.includes(p.cultura)) &&
            (variedadeSelecionada.length === 0 ||
                nomesVariedadesSelecionadas.includes(p.variedade))
    );

    // Estágios: as opções já vêm do pai (deduplicadas por nome).
    // Aqui só ordenamos para exibição.
    const estagiosOrdenados = (estagios || []).slice().sort((a, b) =>
        (a.label || "").localeCompare(b.label || "")
    );

    const limparFiltros = () => {
        setCulturaSelecionada([]);
        setVariedadeSelecionada([]);
        setParcelaSelecionada([]);
        setEstagioSelecionado([]);
    };

    const hasAnyFilter =
        culturaSelecionada.length > 0 ||
        variedadeSelecionada.length > 0 ||
        parcelaSelecionada.length > 0 ||
        estagioSelecionado.length > 0;

    return (
        <Box ref={containerRef} sx={{ width: "100%", position: "relative" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "10px",
                    minWidth: "500px",
                    marginTop: "10px",
                    paddingLeft: "10px",
                    minHeight: "37px",
                }}
            >
                <IconButton
                    size="small"
                    onClick={() => setShowFilters((prev) => !prev)}
                    title="Mostrar/Ocultar filtros"
                >
                    <FilterAltIcon color={!showFilters ? "inherit" : "success"} />
                </IconButton>

                <Slide
                    direction="right"
                    in={showFilters}
                    mountOnEnter
                    unmountOnExit
                    container={containerRef.current}
                >
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {/* Cultura */}
                        <FormControl sx={{ width: "200px" }}>
                            <InputLabel id="cultura-label">Cultura</InputLabel>
                            <Select
                                labelId="cultura-label"
                                value={culturaSelecionada}
                                label="Cultura"
                                size="small"
                                multiple
                                onChange={(e) => {
                                    setCulturaSelecionada(e.target.value);
                                    setVariedadeSelecionada([]);
                                    // opcional: limpar estágios ao trocar cultura
                                    setEstagioSelecionado([]);
                                }}
                                renderValue={(selected) =>
                                    culturas
                                        .filter((c) => selected.includes(c.id))
                                        .map((c) => c.nome)
                                        .join(", ")
                                }
                            >
                                {culturas.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Variedade */}
                        <FormControl
                            sx={{ width: "200px" }}
                            disabled={culturaSelecionada.length === 0}
                        >
                            <InputLabel id="variedade-label">Variedade</InputLabel>
                            <Select
                                labelId="variedade-label"
                                multiple
                                value={variedadeSelecionada}
                                label="Variedade"
                                size="small"
                                onChange={(e) => {
                                    setVariedadeSelecionada(e.target.value);
                                    // opcional: limpar estágios ao trocar variedade
                                    setEstagioSelecionado([]);
                                }}
                                renderValue={(selected) =>
                                    variedades
                                        .filter((v) => selected.includes(v.id))
                                        .map((v) => v.nome)
                                        .join(", ")
                                }
                            >
                                {variedadesFiltradas.map((v) => (
                                    <MenuItem key={v.id} value={v.id}>
                                        {v.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Parcela */}
                        <FormControl
                            sx={{
                                minWidth: "200px",
                                width: Math.min(100 + parcelaSelecionada.length * 20, 400),
                                transition: "width 0.3s ease",
                            }}
                        >
                            <InputLabel id="parcela-label">Parcela</InputLabel>
                            <Select
                                labelId="parcela-label"
                                multiple
                                value={parcelaSelecionada}
                                label="Parcela"
                                size="small"
                                onChange={(e) => {
                                    setParcelaSelecionada(e.target.value);
                                    // opcional: limpar estágios ao trocar parcela
                                    setEstagioSelecionado([]);
                                }}
                                renderValue={(selected) =>
                                    parcelasFiltradas
                                        .filter((p) => selected.includes(p.id))
                                        .sort((a, b) => a.nome.localeCompare(b.nome))
                                        .map((p) => p.nome)
                                        .join(", ")
                                }
                                MenuProps={{
                                    PaperProps: {
                                        style: { maxHeight: 500 },
                                    },
                                }}
                            >
                                {parcelasFiltradas
                                    .slice()
                                    .sort((a, b) => a.nome.localeCompare(b.nome))
                                    .map((p) => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.nome}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        {/* NOVO: Estágio (deduplicado por nome) */}
                        <FormControl
                            sx={{ width: "260px" }}
                            disabled={estagiosOrdenados.length === 0}
                        >
                            <InputLabel id="estagio-label">Estágio</InputLabel>
                            <Select
                                labelId="estagio-label"
                                multiple
                                value={estagioSelecionado}
                                label="Estágio"
                                size="small"
                                onChange={(e) => setEstagioSelecionado(e.target.value)}
                                renderValue={(selected) =>
                                    estagiosOrdenados
                                        .filter((s) => selected.includes(s.id))
                                        .map((s) =>
                                            s.count ? `${s.label} (${s.count})` : s.label
                                        )
                                        .join(", ")
                                }
                                MenuProps={{
                                    PaperProps: {
                                        style: { maxHeight: 500 },
                                    },
                                }}
                            >
                                {estagiosOrdenados.map((s) => (
                                    <MenuItem key={s.id} value={s.id}>
                                        {s.label}
                                        {s.count ? ` (${s.count})` : ""}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Limpar */}
                        {hasAnyFilter && (
                            <IconButton
                                size="small"
                                onClick={limparFiltros}
                                sx={{ marginLeft: "10px", marginRight: 1 }}
                                title="Limpar filtros"
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                        <div className="print-safe-wrapper" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={openMontarCalda}
                                startIcon={<PlaylistAddRoundedIcon />}
                                sx={{ textTransform: "none", fontWeight: 800 }}
                            >
                                Montar Calda Avulsa
                            </Button>

                            <Chip
                                size="small"
                                color={caldaAvulsa.length ? "success" : "default"}
                                label={`Itens: ${caldaAvulsa.length}`}
                                sx={{ fontWeight: 800 }}
                            />

                            <IconButton
                                size="small"
                                onClick={handleClearCaldaAvulsa}
                                disabled={!caldaAvulsa.length}
                                title="Limpar Calda Avulsa"
                            >
                                <PlaylistRemoveRoundedIcon fontSize="small" />
                            </IconButton>
                        </div>
                    </Box>
                </Slide>
            </Box>
        </Box>
    );
};

export default SelectCulturaVariedade;
