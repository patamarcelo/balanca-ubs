import Button from "@mui/material/Button";

const CustomButton = (props) => {
	const { title, color, ml, handleOpenModal } = props;
	return (
		<Button
			variant="contained"
			sx={{
				backgroundColor: color,
				marginLeft: `${ml}px`
			}}
			startIcon={props.children}
			onClick={handleOpenModal}
		>
			{title}
		</Button>
	);
};

export default CustomButton;
