import Button from "@mui/material/Button";

const CustomButton = (props) => {
	const {
		title,
		color,
		ml,
		handleOpenModal,
		isBalanca,
		size,
		fontColor,
		height
	} = props;

	const fontColorAdj = (fontColor) => {
		if (fontColor) {
			return fontColor;
		}
		return "white";
	};
	return (
		<Button
			variant="contained"
			sx={{
				backgroundColor: color,
				marginLeft: `${ml}px`,
				color: fontColorAdj(fontColor),
				":hover": {
					color: "white"
				},
				height
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
