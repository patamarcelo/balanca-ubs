import Button from "@mui/material/Button";

const CustomButton = (props) => {
	const { title, color, ml, handleOpenModal , isBalanca } = props;
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
		>
			{title}
		</Button>
	);
};

export default CustomButton;
