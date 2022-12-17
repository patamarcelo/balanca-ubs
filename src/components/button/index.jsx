import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const CustomButton = (props) => {
	const { title, color, ml } = props;
	return (
		<Button
			variant="contained"
			sx={{
				backgroundColor: color,
				marginLeft: `${ml}px`
			}}
			startIcon={props.children}
		>
			{title}
		</Button>
	);
};

export default CustomButton;
