import { Typography } from "@mui/material";
const PrintVersion = ({ programData, version }) => {
	return (
		<div contentEditable style={{ textAlign: "center" }}>
			<Typography variant="h6" color="black">
				{programData.nome_fantasia} - Versão {version}
			</Typography>
		</div>
	);
};

export default PrintVersion;
