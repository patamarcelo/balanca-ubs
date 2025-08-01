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
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const containerRef = useRef(null);

    const variedadesFiltradas = variedades.filter((v) =>
        culturaSelecionada.includes(v.cultura)
    );

    const limparFiltros = () => {
        setCulturaSelecionada([]);
        setVariedadeSelecionada([]);
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
                        gap: '20px',
                        width: '500px',
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
                        sx={{ width: '300px' }}
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

                    {(culturaSelecionada.length > 0 || variedadeSelecionada.length > 0) && (
                        <IconButton
                            size="small"
                            onClick={limparFiltros}
                            sx={{ marginLeft: 'auto', marginRight: 1 }}
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