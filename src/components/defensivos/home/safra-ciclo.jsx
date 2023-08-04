import { Box, Typography, Button, useTheme } from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { setSafraCilco } from "../../../store/plantio/plantio.actions";

import classes from "../data-program/data-program.module.css";

const SafraCicloComp = () => {
	const dispatch = useDispatch();
	const safraDict = {
		first: "2022/2023",
		second: "2023/2024"
	};

	const cicloDict = {
		first: "1",
		second: "2",
		third: "3"
	};

	const [safra, setSafra] = useState(safraDict.second);
	const [ciclo, setCiclo] = useState(cicloDict.first);

	const handleChange = (event) => {
		setSafra(event.target.value);
	};

	const handleChangeCiclo = (event) => {
		setCiclo(event.target.value);
	};

	useEffect(() => {
		dispatch(setSafraCilco({ safra, ciclo }));
	}, [safra, ciclo, dispatch]);

	return (
		<Box
			sx={{
				maxHeight: " 33px",
				flexGrow: 1,
				display: "flex",
				justifyContent: "center"
			}}
		>
			<div className={classes["date-picker"]}>
				<FormControl
					variant="outlined"
					size="small"
					sx={{ m: 1, minWidth: 120 }}
				>
					<InputLabel id="demo-simple-select-standard-label-safra">
						Safra
					</InputLabel>
					<Select
						labelId="demo-simple-select-standard-label-safra"
						id="demo-simple-select-standard-safra"
						value={safra}
						onChange={handleChange}
						label="Safra"
					>
						<MenuItem value="">
							<em>Safra</em>
						</MenuItem>
						<MenuItem value={safraDict.first}>2022/2023</MenuItem>
						<MenuItem value={safraDict.second}>2023/2024</MenuItem>
					</Select>
				</FormControl>
				<FormControl
					variant="outlined"
					size="small"
					sx={{ m: 1, minWidth: 120, marginLeft: "80px" }}
				>
					<InputLabel id="demo-simple-select-standard-label-ciclo">
						Ciclo
					</InputLabel>
					<Select
						labelId="demo-simple-select-standard-label-ciclo"
						id="demo-simple-select-standard-ciclo"
						value={ciclo}
						onChange={handleChangeCiclo}
						label="Ciclo"
					>
						<MenuItem value="">
							<em>Ciclo</em>
						</MenuItem>
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
