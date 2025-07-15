import { Box, Typography, useTheme } from '@mui/material'
import { tokens } from '../../../theme'

const CardDiviOperations = (props) => {
    const { title, value } = props

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const formatNumber = (data) => {
        return data.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    }
    if(value === 0){
        return
    }
    return (
        <Box>
            <Typography variant="h6" color={colors.primary[100]} >
                {title}:
            </Typography>
            <Typography variant="h7" color={colors.primary[200]} sx={{marginLeft: '0px', fontWeight: 'bold'}}>
                {formatNumber(value)}
            </Typography>
        </Box>
    );
}

export default CardDiviOperations;