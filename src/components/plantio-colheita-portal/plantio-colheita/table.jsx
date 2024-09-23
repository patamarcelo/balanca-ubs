import Table from "react-bootstrap/Table";
import styles from "./plantio-colheita.module.css";
import { useTheme } from '@mui/material'
import { tokens } from '../../../theme'

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import cotton from '../../../utils/assets/icons/cotton.png'
import question from '../../../utils/assets/icons/question.png'

const TableColheita = ({ data, idsPending }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "FEIJAO MUNGO", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" },
		{ cultura: "Algodão", icon: cotton, alt: "algodao" },
	];

	const filteredIcon = (data) => {
		const filtered = iconDict.filter(
			(dictD) => dictD.cultura === data
		);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return question;
	};

	const filteredAlt = (data) => {
		const filtered = iconDict.filter(
			(dictD) => dictD.cultura === data
		);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return question;
	};

	console.log('dataTable', data);

	return (
		<Table striped bordered hover style={{ width: "100%", color: colors.textColor[100] }} size="sm" className={styles.mainTable}>
			<thead style={{backgroundColor: colors.blueOrigin[300]}}>
				<tr>
					<th>Parcela</th>
					<th>Data Plantio</th>
					<th>Dap</th>
					<th>Cultura</th>
					<th>Variedade</th>
					{/* <th>Projeto</th> */}
					<th>Area</th>
					<th>Area Colhida</th>
					<th>Peso Carregado / Scs</th>
					<th>Romaneios Computados</th>
					<th>Romaneios Pendentes</th>
					<th>Média Prev.</th>
				</tr>
			</thead>
			<tbody>
				{data.map((carga, i) => {
					const areaParcial = carga.area_parcial
						? carga.area_parcial
						: 0;
					const formatDate = (data) => {
						const newDate = new Date(data);
						const formatedDate =
							newDate.toLocaleDateString("pt-BR");
						return formatedDate;
					};

					const scsColhidos = Number(carga.peso / 60).toLocaleString(
						"pt-br",
						{
							maximumFractionDigits: 2,
							minimumFractionDigits: 2
						}
					);
					const formatArea = (number) => {
						return Number(number).toLocaleString("pt-br", {
							maximumFractionDigits: 2,
							minimumFractionDigits: 2
						});
					};

					const mediaPrev = carga.peso && carga.area_parcial ?  Number(carga.peso / 60) / carga.area_parcial : 0

					const romaneiosPending =  idsPending[carga.id] ? idsPending[carga.id] : " - "
					return (
						<tr key={i}
							className={`${
								i % 2 === 0 ? styles.oddRow : styles.evenRow
							} ${
								carga.romaneios > 0 || areaParcial > 0 || romaneiosPending > 0
									? styles.colheitaRow
									: styles.notColheitaRow
							} ${areaParcial === carga.area_colheita && romaneiosPending === " - " && i % 2 === 0 && styles.closedParcelaOdd} 
							${areaParcial === carga.area_colheita && romaneiosPending === " - " && i % 2 !== 0 && styles.closedParcelaEven} 
							${theme.palette.mode === 'light'  && i % 2 !== 0 && styles.oddRowLight}`}
						>
							<td>{carga.talhao__id_talhao}</td>
							<td>{formatDate(carga.data_plantio)}</td>
							<td>{carga.dap}</td>
							<td>
										<img
											src={filteredIcon(
												carga.variedade__cultura__cultura
											)}
											alt={filteredAlt(
												carga.variedade__cultura__cultura
											)}
											style={{
												filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))",
												width: '20px',
												height: '20px'
											}}
										/>
									</td>
									<td>{carga.variedade__nome_fantasia}</td>
							
							{/* <td>
								{carga.talhao__fazenda__nome.replace(
									"Projeto",
									""
								)}
							</td> */}
							<td>{formatArea(carga.area_colheita)}</td>
							<td
								className={`${
									carga.romaneios > 0 &&
									areaParcial === 0 &&
									styles.semAreaInformada
								}`}
							>
								{formatArea(areaParcial)}
							</td>
							<td
								className={`${
									areaParcial > 0 &&
									carga.romaneios === 0 &&
									styles.semAreaInformada
								}`}
							>
								{scsColhidos}
							</td>
							<td
								className={`${
									areaParcial > 0 &&
									carga.romaneios === 0 &&
									styles.semAreaInformada
								}`}
							>
								{carga.romaneios}
							</td>
							<td style={{color: romaneiosPending > 0 ? "rgb(148, 148, 55)" : colors.textColor[100] }}>{romaneiosPending}</td>
							<td>
								{formatArea(mediaPrev)}
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};

export default TableColheita;
