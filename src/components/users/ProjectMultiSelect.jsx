// src/components/users/ProjectMultiSelect.jsx

import {
	Box,
	Button,
	Checkbox,
	Chip,
	Divider,
	FormControl,
	FormHelperText,
	InputLabel,
	ListSubheader,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";

import { tokens } from "../../theme";
import { getAllProjects, getProjectsByFarm, sortProjects } from "./projectsCatalog";

const ITEM_HEIGHT = 44;
const ITEM_PADDING_TOP = 8;

const ProjectMultiSelect = ({
	label = "Projetos liberados",
	value = [],
	onChange,
	helperText = "Selecione os projetos liberados para este usuário.",
}) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isDark = theme.palette.mode === "dark";

	const selectedProjects = sortProjects(Array.isArray(value) ? value : []);
	const groups = getProjectsByFarm();

	const emitChange = (nextProjects) => {
		onChange?.(sortProjects(nextProjects));
	};

	const toggleProject = (project) => {
		const alreadySelected = selectedProjects.includes(project);

		const nextProjects = alreadySelected
			? selectedProjects.filter((item) => item !== project)
			: [...selectedProjects, project];

		emitChange(nextProjects);
	};

	const selectFarmProjects = (projects = []) => {
		emitChange([...selectedProjects, ...projects]);
	};

	const clearFarmProjects = (projects = []) => {
		const projectsSet = new Set(projects);
		emitChange(selectedProjects.filter((project) => !projectsSet.has(project)));
	};

	const selectAllProjects = () => {
		emitChange(getAllProjects());
	};

	const clearAllProjects = () => {
		emitChange([]);
	};

	return (
		<Box>
			<FormControl fullWidth>
				<InputLabel>{label}</InputLabel>

				<Select
					multiple
					value={selectedProjects}
					label={label}
					input={<OutlinedInput label={label} />}
					renderValue={(selected) => {
						const selectedSorted = sortProjects(
							Array.isArray(selected) ? selected : []
						);

						if (!selectedSorted.length) {
							return (
								<Typography variant="body2" sx={{ opacity: 0.55 }}>
									Nenhum projeto selecionado
								</Typography>
							);
						}

						return (
							<Box
								sx={{
									display: "flex",
									flexWrap: "wrap",
									gap: 0.6,
									maxHeight: 86,
									overflowY: "auto",
									pr: 0.5,
								}}
							>
								{selectedSorted.map((project) => (
									<Chip
										key={project}
										label={project}
										size="small"
										onMouseDown={(event) => event.stopPropagation()}
										sx={{
											height: 22,
											fontSize: 11,
											fontWeight: 800,
											backgroundColor: "rgba(76,206,172,0.12)",
											color: colors.greenAccent[400],
										}}
									/>
								))}
							</Box>
						);
					}}
					MenuProps={{
						PaperProps: {
							sx: {
								maxHeight: ITEM_HEIGHT * 11 + ITEM_PADDING_TOP,
								borderRadius: 3,
								mt: 1,
								backgroundColor: isDark ? colors.primary[700] : "#fff",
								border: `1px solid ${
									isDark
										? "rgba(255,255,255,0.10)"
										: "rgba(20,27,45,0.10)"
								}`,
							},
						},
					}}
					sx={{
						borderRadius: 2.2,
						alignItems: "flex-start",
						minHeight: 76,
						backgroundColor: isDark ? "rgba(255,255,255,0.045)" : "#fff",
						"& fieldset": {
							borderColor: isDark
								? "rgba(255,255,255,0.09)"
								: "rgba(20,27,45,0.12)",
						},
						"&:hover fieldset": {
							borderColor: colors.greenAccent[500],
						},
						"&.Mui-focused fieldset": {
							borderColor: colors.greenAccent[500],
						},
					}}
				>
					<ListSubheader
						disableSticky
						sx={{
							py: 1,
							backgroundColor: isDark ? colors.primary[700] : "#fff",
						}}
					>
						<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
							<Button
								size="small"
								variant="outlined"
								onClick={(event) => {
									event.stopPropagation();
									selectAllProjects();
								}}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 900,
								}}
							>
								Selecionar todos
							</Button>

							<Button
								size="small"
								variant="outlined"
								color="error"
								onClick={(event) => {
									event.stopPropagation();
									clearAllProjects();
								}}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 900,
								}}
							>
								Limpar
							</Button>
						</Stack>
					</ListSubheader>

					<Divider sx={{ opacity: 0.12 }} />

					{groups.flatMap((group) => {
						const farmProjects = sortProjects(group.projetos);
						const selectedFromFarm = farmProjects.filter((project) =>
							selectedProjects.includes(project)
						);

						const allFarmSelected =
							farmProjects.length > 0 &&
							selectedFromFarm.length === farmProjects.length;

						return [
							<ListSubheader
								key={`header-${group.fazenda}`}
								disableSticky
								sx={{
									pt: 1,
									pb: 0.5,
									backgroundColor: isDark ? colors.primary[700] : "#fff",
								}}
							>
								<Stack
									direction="row"
									alignItems="center"
									justifyContent="space-between"
									spacing={1}
								>
									<Box>
										<Typography
											variant="caption"
											sx={{
												fontWeight: 900,
												color: colors.greenAccent[400],
												display: "block",
											}}
										>
											{group.fazenda}
										</Typography>

										<Typography
											variant="caption"
											sx={{
												opacity: 0.55,
												display: "block",
												lineHeight: 1.2,
											}}
										>
											{selectedFromFarm.length}/{farmProjects.length} selecionado(s)
										</Typography>
									</Box>

									<Button
										size="small"
										variant="text"
										onClick={(event) => {
											event.stopPropagation();

											if (allFarmSelected) {
												clearFarmProjects(farmProjects);
											} else {
												selectFarmProjects(farmProjects);
											}
										}}
										sx={{
											borderRadius: 999,
											textTransform: "none",
											fontWeight: 900,
											color: allFarmSelected
												? colors.redAccent[400]
												: colors.greenAccent[400],
										}}
									>
										{allFarmSelected ? "Remover fazenda" : "Selecionar fazenda"}
									</Button>
								</Stack>
							</ListSubheader>,

							...farmProjects.map((project) => {
								const checked = selectedProjects.includes(project);

								return (
									<MenuItem
										key={project}
										value={project}
										onClick={(event) => {
											event.preventDefault();
											event.stopPropagation();
											toggleProject(project);
										}}
										sx={{
											borderRadius: 1.5,
											mx: 0.75,
											my: 0.15,
										}}
									>
										<Checkbox
											size="small"
											checked={checked}
											onClick={(event) => {
												event.preventDefault();
												event.stopPropagation();
												toggleProject(project);
											}}
											sx={{
												color: colors.greenAccent[500],
												"&.Mui-checked": {
													color: colors.greenAccent[500],
												},
											}}
										/>

										<Typography variant="body2" fontWeight={700}>
											{project}
										</Typography>
									</MenuItem>
								);
							}),
						];
					})}
				</Select>

				<FormHelperText>{helperText}</FormHelperText>
			</FormControl>
		</Box>
	);
};

export default ProjectMultiSelect;