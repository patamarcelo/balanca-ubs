import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
const ImageLoaderRegistros = ({ data }) => {
	const [isLoading, setisLoading] = useState(true);

	return (
		<>
			{isLoading && (
				<Skeleton
					variant="rectangular"
					width={200}
					height={200}
					sx={{ marginLeft: "auto", borderRadius: "12px" }}
				/>
			)}
			<img
				src={data.image_url}
				alt={data.image_title}
				onLoad={() => setisLoading(false)}
				style={{
					width: isLoading ? "0px" : "360px",
					height: isLoading ? "0px" : "360px",
					objectFit: "cover",
					margin: "4px",
					transition: "width 0.5s",
					borderRadius: "8px",
					border: "0.5px solid black"
				}}
			/>
		</>
	);
};

export default ImageLoaderRegistros;
