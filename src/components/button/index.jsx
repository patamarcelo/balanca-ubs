import Button from "@mui/material/Button";

const CustomButton = (props) => {
	const { title, color, ml, handleOpenModal, isBalanca, size } = props;
	return (
		<Button
			variant="contained"
			sx={{
				backgroundColor: color,
				marginLeft: `${ml}px`
			}}
			startIcon={props.children}
			onClick={handleOpenModal}
			disabled={isBalanca}
			size={size}
		>
			{title}
		</Button>
	);
};

export default CustomButton;
