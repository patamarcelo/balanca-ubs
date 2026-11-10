import { Accordion, AccordionSummary, AccordionDetails, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { parseArea } from './partial-area';

const ComplementAreasTable = ({ aps, areas, setAreas, error }) => {
    if (!aps.length) return null;

    return (
        <Accordion
            disableGutters
            elevation={0}
            TransitionProps={{ unmountOnExit: true }}
            sx={{
                my: 2, mx: '20px', maxWidth: 750,
                border: '1px solid', borderColor: error ? 'error.main' : 'divider',
                borderRadius: '12px !important', overflow: 'hidden',
                '&:before': { display: 'none' },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ bgcolor: 'action.hover', '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 } }}
            >
                <Typography sx={{ fontWeight: 600 }}>Solicitar complemento de produtos</Typography>
                {aps.some((ap) => Number.isFinite(parseArea(areas[ap])) && parseArea(areas[ap]) > 0) &&
                    <Chip label="Complemento ativo" size="small" color="success" variant="outlined" />}
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Informe a área apenas quando precisar de complemento. Deixe vazio para manter a quantidade original.
                </Typography>
                <TableContainer>
                    <Table size="small" aria-label="Áreas de complemento por AP">
                        <TableHead>
                            <TableRow>
                                <TableCell>AP</TableCell>
                                <TableCell>Área de complemento (ha)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {aps.map((ap) => (
                                <TableRow key={ap}>
                                    <TableCell>
                                        {ap.split(' | ')[0]}
                                        {Number.isFinite(parseArea(areas[ap])) && parseArea(areas[ap]) > 0 &&
                                            ` | ${parseArea(areas[ap]).toLocaleString('pt-BR', { maximumFractionDigits: 20 })} Há`}
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            value={areas[ap] ?? ''}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                setAreas((prev) => ({ ...prev, [ap]: value }));
                                            }}
                                            inputProps={{ inputMode: 'decimal', 'aria-label': `Área de complemento (ha) - ${ap.split(' | ')[0]}` }}
                                            error={Boolean(areas[ap] && error)}
                                            sx={{ width: 180 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {error && <Typography color="error">{error}</Typography>}
            </AccordionDetails>
        </Accordion>
    );
};

export default ComplementAreasTable;
