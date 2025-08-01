import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    Slide,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const SelectCulturaVariedade = ({
    culturaSelecionada,
    setCulturaSelecionada,
    variedadeSelecionada,
    setVariedadeSelecionada,
    culturas,
    variedades,
    parcelas,
    parcelaSelecionada,
    setParcelaSelecionada
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
            (culturaSelecionada.length === 0 || culturaSelecionada.includes(p.cultura)) &&
            (variedadeSelecionada.length === 0 || nomesVariedadesSelecionadas.includes(p.variedade))
    );

    const limparFiltros = () => {
        setCulturaSelecionada([]);
        setVariedadeSelecionada([]);
        setParcelaSelecionada([]);
    };

    return (
        <Box ref={containerRef} sx={{ width: '100%', position: 'relative' }}>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    minWidth: '500px',
                    marginTop: '10px',
                    paddingLeft: '10px',
                    minHeight: '37px',
                }}
            >
                <IconButton
                    size="small"
                    onClick={() => setShowFilters((prev) => !prev)}
                    title="Mostrar/Ocultar filtros"
                >
                    <FilterAltIcon color={!showFilters ? 'inherit' : 'success'} />
                </IconButton>
                <Slide
                    direction="right"
                    in={showFilters}
                    mountOnEnter
                    unmountOnExit
                    container={containerRef.current}
                >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ width: '200px' }}>
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
                                }}
                                renderValue={(selected) =>
                                    culturas
                                        .filter((c) => selected.includes(c.id))
                                        .map((c) => c.nome)
                                        .join(', ')
                                }
                            >
                                {culturas.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl
                            sx={{ width: '200px' }}
                            disabled={culturaSelecionada.length === 0}
                        >
                            <InputLabel id="variedade-label">Variedade</InputLabel>
                            <Select
                                labelId="variedade-label"
                                multiple
                                value={variedadeSelecionada}
                                label="Variedade"
                                size="small"
                                onChange={(e) => setVariedadeSelecionada(e.target.value)}
                                renderValue={(selected) =>
                                    variedades
                                        .filter((v) => selected.includes(v.id))
                                        .map((v) => v.nome)
                                        .join(', ')
                                }
                            >
                                {variedadesFiltradas.map((v) => (
                                    <MenuItem key={v.id} value={v.id}>
                                        {v.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl
                            sx={{
                                minWidth: '200px',
                                width: Math.min(100 + parcelaSelecionada.length * 20, 400), // dinâmica
                                transition: 'width 0.3s ease',
                            }}
                        >
                            <InputLabel id="parcela-label">Parcela</InputLabel>
                            <Select
                                labelId="parcela-label"
                                multiple
                                value={parcelaSelecionada}
                                label="Parcela"
                                size="small"
                                onChange={(e) => setParcelaSelecionada(e.target.value)}
                                renderValue={(selected) =>
                                    parcelasFiltradas
                                        .filter((p) => selected.includes(p.id))
                                        .sort((a, b) => a.nome.localeCompare(b.nome))
                                        .map((p) => p.nome)
                                        .join(', ')
                                }
                            >
                                {parcelasFiltradas
                                    .sort((a, b) => a.nome.localeCompare(b.nome))
                                    .map((p) => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.nome}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        {(culturaSelecionada.length > 0 || variedadeSelecionada.length > 0 || parcelaSelecionada.length > 0) && (
                            <IconButton
                                size="small"
                                onClick={limparFiltros}
                                sx={{ marginLeft: '10px', marginRight: 1 }}
                                title="Limpar filtros"
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                    </Box>
                </Slide>
            </Box>
        </Box >
    );
};

export default SelectCulturaVariedade;