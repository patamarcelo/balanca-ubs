import { Box, useTheme, Typography } from '@mui/material'
import { tokens } from '../../../theme';

const ColheitaPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    console.log('abrindo a pagina da colheita: ')
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                // backgroundColor:  'red'
            }}
        >
            <Typography variant='h4' color={colors.textColor[100]}>
                Página da Colheita
            </Typography>
        </Box>
    );
}

export default ColheitaPage;