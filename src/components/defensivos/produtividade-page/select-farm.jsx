import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const SelectFarm = (props) => {
	const { projetos, handleChange, value } = props;
	return (
		<FormControl sx={{ m: 1, minWidth: 280 }}>
			<InputLabel id="demo-simple-select-label">Projeto</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={value}
				label="Age"
				onChange={handleChange}
			>
				{projetos.map((data, i) => {
					return (
						<MenuItem key={i} value={data}>
							{data}
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
};

export default SelectFarm;
