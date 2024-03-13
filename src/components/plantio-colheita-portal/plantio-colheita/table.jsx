import Table from "react-bootstrap/Table";
import styles from "./plantio-colheita.module.css";

const TableColheita = ({ data, colors, idsPending }) => {
	return (
		<Table striped bordered hover style={{ width: "100%", color: colors.textColor[100] }} size="sm" className={styles.mainTable}>
			<thead>
				<tr>
					<th>Parcela</th>
					<th>Data Plantio</th>
					<th>Dap</th>
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
								carga.romaneios > 0 || areaParcial > 0
									? styles.colheitaRow
									: styles.notColheitaRow
							}`}
						>
							<td>{carga.talhao__id_talhao}</td>
							<td>{formatDate(carga.data_plantio)}</td>
							<td>{carga.dap}</td>
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
							<td style={{color: romaneiosPending > 0 && 'yellow'}}>{romaneiosPending}</td>
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
