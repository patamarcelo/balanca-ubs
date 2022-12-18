import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from '@mui/material';


const HomeTableTruck = (props) => {
	const { table } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<>
			{table.map((data, i) => {
				return (
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						gap="10px"
                        width="100%"
						sx={{
							width: "98%",
							backgroundColor: colors.blueOrigin[900],
							borderRadius: "5px",
							padding: "10px"
						}}
					>
						<Box>
							{data.tipo === "carregando" ? (
								<FontAwesomeIcon
									color={colors.greenAccent[600]}
									icon={faTruckMoving}
									size="3x"
									className="fa-flip-horizontal"
								/>
							) : (
								<FontAwesomeIcon
									color={colors.redAccent[600]}
									icon={faTruckMoving}
									size="3x"
								/>
							)}
						</Box>
						<Box>{data.umidade}</Box>
						<Box
                        sx={{cursor: 'pointer'}}
                        >
                            <IconButton aria-label="edit">
                                <FontAwesomeIcon icon={faPenToSquare} color={colors.yellow[700]} size="1x"/>
                            </IconButton>
                            
                        </Box>
					</Box>
				);
			})}
		</>
	);
};

export default HomeTableTruck;
