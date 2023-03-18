import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import CustomButton from "../../../components/button";

import { useSelector } from "react-redux";
import {
	selectIBalancaUser
	// selectUnidadeOpUser
} from "../../../store/user/user.selector";

import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useMediaQuery from "@mui/material/useMediaQuery";
import toast from "react-hot-toast";

const AddButton = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { setIsOpen, isOpen } = props;

	const isCellPhone = useMediaQuery("(min-width: 500px)");
	const isBalanca = useSelector(selectIBalancaUser);

	const handlerSubmit = () => {
		toast.success(`Adicionar Ordem`, {
			position: "top-center"
		});
		setIsOpen(true);
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			gap="20px"
			sx={{
				width: "100%",
				height: "100%"
				// border: "1px solid white"
			}}
		>
			<Box
				display="flex"
				justifyContent={!isCellPhone && "space-between"}
			>
				<CustomButton
					// isBalanca={!isBalanca}
					title={`Add Ordem`}
					color={colors.greenAccent[600]}
					handleOpenModal={handlerSubmit}
					isBalanca={isOpen}
				>
					<FontAwesomeIcon icon={faClipboard} />
				</CustomButton>
			</Box>
		</Box>
	);
};

export default AddButton;
