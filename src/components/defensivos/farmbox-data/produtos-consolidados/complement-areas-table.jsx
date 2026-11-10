import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

import { parseArea } from './partial-area';

const ComplementAreasTable = ({ aps, areas, setAreas, error }) => {
    if (!aps.length) return null;

    return (
        <Box sx={{ my: 2, mx: '20px', maxWidth: 650 }}>
            <Typography variant="h6">Solicitar complemento de produtos</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
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
                                    {ap.split(' | ')[0].match(/AP\d+/i)?.[0] || ap.split(' | ')[0]}
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
        </Box>
    );
};

export default ComplementAreasTable;
