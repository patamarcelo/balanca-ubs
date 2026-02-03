import { Box } from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setSafraCilco } from "../../../store/plantio/plantio.actions";
import { selectSafraCiclo } from "../../../store/plantio/plantio.selector";

import classes from "../data-program/data-program.module.css";

const SafraCicloComp = () => {
	const dispatch = useDispatch();
	const safraCiclo = useSelector(selectSafraCiclo);
	const safraDict = {
		first: "2022/2023",
		second: "2023/2024",
		third: '2024/2025',
		fourth: '2025/2026',
		fifth: '2026/2027'
	};

	const cicloDict = {
		first: "1",
		second: "2",
		third: "3"
	};

	const [safra, setSafra] = useState("");
	const [ciclo, setCiclo] = useState("");
	// const [safra, setSafra] = useState(safraDict.second);
	// const [ciclo, setCiclo] = useState(cicloDict.first);

	const handleChange = (event) => {
		setSafra(event.target.value);
		dispatch(
			setSafraCilco({
				ciclo: safraCiclo.ciclo,
				safra: event.target.value
			})
		);
	};

	const handleChangeCiclo = (event) => {
		setCiclo(event.target.value);
		dispatch(
			setSafraCilco({
				ciclo: event.target.value,
				safra: safraCiclo.safra
			})
		);
	};

	return (
		<Box
			sx={{
				maxHeight: " 33px",
				flexGrow: 1,
				display: "flex",
				justifyContent: "center"
			}}
		>
			<div className={classes["date-picker-safra-ciclo"]}>
				<FormControl
					variant="outlined"
					size="small"
					sx={{ m: 1, minWidth: 80 }}
				>
					<InputLabel id="demo-simple-select-standard-label-safra">
						Safra
					</InputLabel>
					<Select
						labelId="demo-simple-select-standard-label-safra"
						id="demo-simple-select-standard-safra"
						value={safraCiclo.safra}
						onChange={handleChange}
						label="Safra"
					>
						{/* <MenuItem value="">
							<em>Safra</em>
						</MenuItem> */}
						<MenuItem value={safraDict.first}>2022/2023</MenuItem>
						<MenuItem value={safraDict.second}>2023/2024</MenuItem>
						<MenuItem value={safraDict.third}>2024/2025</MenuItem>
						<MenuItem value={safraDict.fourth}>2025/2026</MenuItem>
						<MenuItem value={safraDict.fifth}>2026/2027</MenuItem>
					</Select>
				</FormControl>
				<FormControl
					variant="outlined"
					size="small"
					sx={{ m: 1, minWidth: 80 }}
				>
					<InputLabel id="demo-simple-select-standard-label-ciclo">
						Ciclo
					</InputLabel>
					<Select
						labelId="demo-simple-select-standard-label-ciclo"
						id="demo-simple-select-standard-ciclo"
						value={safraCiclo.ciclo}
						onChange={handleChangeCiclo}
						label="Ciclo"
					>
						{/* <MenuItem value="">
							<em>Ciclo</em>
						</MenuItem> */}
						<MenuItem value={cicloDict.first}>
							{cicloDict.first}
						</MenuItem>
						<MenuItem value={cicloDict.second}>
							{cicloDict.second}
						</MenuItem>
						<MenuItem value={cicloDict.third}>
							{cicloDict.third}
						</MenuItem>
					</Select>
				</FormControl>
			</div>
		</Box>
	);
};
export default SafraCicloComp;
