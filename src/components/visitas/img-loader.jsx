import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
const ImageLoader = ({ data }) => {
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
				src={data.registros.image_url}
				alt={data.registros.image_title}
				onLoad={() => setisLoading(false)}
				style={{
					width: isLoading ? "0px" : "200px",
					height: isLoading ? "0px" : "200px",
					objectFit: "cover",
					marginLeft: "auto",
					transition: "width 0.5s",
					borderRadius: "12px"
				}}
			/>
		</>
	);
};

export default ImageLoader;
