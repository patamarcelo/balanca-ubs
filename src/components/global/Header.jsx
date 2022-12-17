import { Box, Typography, useTheme } from '@mui/material'
import { tokens } from '../../theme'


const Header = ({title}) => {
    const theme = useTheme();
	const colors = tokens(theme.palette.mode);


    return (
        <Box display='flex' justifyContent='center' alignItems='center' mt="30px">
            <Typography variant="h2" color={colors.pink[200]}>
                    {title}
                </Typography>
        </Box>
    )
}

export default Header