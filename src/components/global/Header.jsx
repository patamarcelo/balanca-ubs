import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import IconButton from "@mui/material/IconButton";



import { signOutUser } from "../../utils/firebase/firebase";
import { useDispatch } from "react-redux";
import { logOffUser } from "../../store/user/user.action";


const Header = ({toggleDrawer, isdrawerOpen}) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();


    const handlerLogout = () => {
		dispatch(logOffUser());
		signOutUser();
		console.log("log out");
	};

	return (
		<Box
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			mt="20px"
			width="100%"
			sx={{ 
                padding: '0px 10px 0px 10px' 
            }}
		>
			<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					onClick={toggleDrawer}
					sx={{
						cursor: "pointer",
						width: "30px",
						height: "30px",
						marginRight: "20px",
					}}
				>
					<MenuIcon
						sx={{
							fontSize: "30px"
						}}
					/>
				</Box>
			<Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            sx={{
            backgroundColor: colors.blueOrigin[800],
            padding: '0px 10px 0px 20px',
            borderRadius: '8px',
            boxShadow: `${colors.blueOrigin[900]} 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.5) -1px -1px 1px 1px inset;`
            }}
            >
                <div>icone 1 </div>
                <div>icone 2 </div>
                <div>icone 3 </div>
                <IconButton onClick={handlerLogout}>
					<PowerSettingsNewOutlinedIcon
						style={{
							color: colors.redAccent[500],
							fontSize: "30px"
						}}
					/>
				</IconButton>
            </Box>
		</Box>
	);
};

export default Header;
