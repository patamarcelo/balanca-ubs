import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const SelectFarm = (props) => {
	const { projetos, handleChange, value, title } = props;
	return (
		<FormControl sx={{ mb: 1, mt: 2, minWidth: 280 }}>
			<InputLabel id="demo-simple-select-label">{title}</InputLabel>
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
