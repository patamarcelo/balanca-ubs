import {
	GridToolbarFilterButton,
	GridToolbarDensitySelector,
	GridToolbarColumnsButton
} from "@mui/x-data-grid";
import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";

export default function CustomToolbar(props) {
	const { title } = props;
	return (
		<GridToolbarContainer>
			<GridToolbarExport
				csvOptions={{
					fileName: title,
					delimiter: ";",
					utf8WithBom: true
				}}
			/>
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector />
			<GridToolbarColumnsButton />
		</GridToolbarContainer>
	);
}
