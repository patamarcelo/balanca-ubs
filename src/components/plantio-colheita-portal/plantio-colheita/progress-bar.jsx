import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { tokens } from '../../../theme';
import { useTheme } from '@emotion/react';



const LinearProgressWithLabel = ({ progress }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1, border: `1px solid ${colors.primary[100]}`,padding: '2px' }}>
            <Box sx={{ width: '100%', mr: 0, backgroundColor: progress < 80 ? colors.yellow[560] : colors.greenAccent[560]}}>
                <Box sx={{width: progress + '%', maxWidth: '100%', backgroundColor: progress < 80 ? colors.yellow[570] : colors.greenAccent[570],  transition: 'width 1s ease-in-out'}}>
                    <Typography variant="body2" sx={{ color: progress < 80 ? 'black' : 'whitesmoke', textAlign: 'center', fontWeight: 'bold' }}>
                        {`${Math.round(progress)}%`}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default LinearProgressWithLabel