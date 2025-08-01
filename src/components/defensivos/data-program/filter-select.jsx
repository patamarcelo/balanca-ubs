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

    const limparFiltros = () => {
        setCulturaSelecionada([]);
        setVariedadeSelecionada([]);
        setParcelaSelecionada([]);
    };

    return (
        <Box ref={containerRef} sx={{ width: '100%', position: 'relative' }}>
            {
                !showFilters &&
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 1,
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={() => setShowFilters((prev) => !prev)}
                        title="Mostrar/Ocultar filtros"
                    >
                        <FilterAltIcon color={showFilters ? 'primary' : 'inherit'} />
                    </IconButton>
                </Box>

            }
            <Slide
                direction="right"
                in={showFilters}
                mountOnEnter
                unmountOnExit
                container={containerRef.current}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '20px',
                        minWidth: '500px',
                        marginTop: '10px',
                        paddingLeft: '10px',
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={() => setShowFilters((prev) => !prev)}
                        title="Mostrar/Ocultar filtros"
                    >
                        <FilterAltIcon color={showFilters ? 'primary' : 'inherit'} />
                    </IconButton>
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
                            width: Math.min(100 + parcelaSelecionada.length * 20, 400), // limita a 400px
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
                                parcelas
                                    .filter((p) => selected.includes(p.id))
                                    .sort((a, b) => a.nome.localeCompare(b.nome))
                                    .map((p) => p.nome)
                                    .join(', ')
                            }
                        >
                            {parcelas.sort((a, b) => a.nome.localeCompare(b.nome)).map((p) => (
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
    );
};

export default SelectCulturaVariedade;