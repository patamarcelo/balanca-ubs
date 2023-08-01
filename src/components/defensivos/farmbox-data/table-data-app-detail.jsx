import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const IconDetail = ({ color }) => {
	return (
		<FontAwesomeIcon
			icon={faCircleCheck}
			color={color ? "green" : "red"}
			size="sm"
			style={{
				margin: "0px 10px",
				cursor: "pointer"
			}}
		/>
	);
};
const DetailAppData = ({ data, showData }) => {
	return (
		<>
			<div>
				{data.parcelas.map((data, i) => {
					return (
						<>
							<p>
								{<IconDetail color={data.aplicado} />}
								{data.parcela}{" "}
								{data.area.toString().replace(".", ",")}
							</p>
						</>
					);
				})}
			</div>
			<div>
				{data.insumos.map((data, i) => {
					return (
						<>
							<p>
								{data.insumo} - {data.tipo} - {data.quantidade}
							</p>
						</>
					);
				})}
			</div>
		</>
	);
};

export default DetailAppData;
