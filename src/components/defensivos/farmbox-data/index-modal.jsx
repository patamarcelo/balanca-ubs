import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useEffect, useState, useCallback } from "react";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Chip from "@mui/material/Chip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import CircularProgress from "@mui/material/CircularProgress";

const IndexModalDataFarmbox = (props) => {
	const { handleCloseFarm, open, children } = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [loading, setLoading] = useState(false);

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "98%",
		height: "98vh",
		bgcolor: colors.blueOrigin[900],
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
		overflowY: "auto"
	};
	return (
		<div>
			<Modal
				keepMounted
				open={open}
				onClose={handleCloseFarm}
				aria-labelledby="keep-mounted-modal-title"
				aria-describedby="keep-mounted-modal-description"
			>
				<Box sx={style} style={{ scrollBehavior: "smooth", zoom: '110%' }}>
					<Box
						id="keep-mounted-modal-title"
						display="flex"
						sx={{
							"& .fa-cirle": {
								marginLeft: "auto"
							},
							"& .fa-cirle:hover": {
								opacity: 0.5
							}
						}}
					>
						<Chip
							id="close-btn"
							label="Farmbox"
							color="primary"
							size="medium"
							sx={{
								backgroundColor: colors.greenAccent[800],
								color: colors.primary[100]
							}}
						/>
						<Box
							className="fa-cirle"
							display="flex"
							justifyContent="center"
							alignItems="center"
							sx={{
								cursor: "pointer"
							}}
						>
							<FontAwesomeIcon
								icon={faCircleXmark}
								onClick={() => handleCloseFarm()}
							/>
						</Box>
						{/* <Chip
							label={"x"}
							color="info"
							size="small"
							sx={{
								color: colors.primary[100]
							}}
						/> */}
					</Box>
					<Box>{children}</Box>
				</Box>
			</Modal>
		</div>
	);
};

export default IndexModalDataFarmbox;
