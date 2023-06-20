import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { PolygonF } from "@react-google-maps/api";
import { useEffect } from "react";
import { useState } from "react";

const containerStyle = {
	width: "98%",
	height: "50vh"
};

const options = {
	fillColor: "white",
	fillOpacity: 0.4,
	strokeColor: "white",
	strokeOpacity: 1,
	strokeWeight: 1,
	clickable: false,
	draggable: false,
	editable: false,
	geodesic: false,
	zIndex: 1
};

const MapOptions = {
	// disableDefaultUI: true
	zoomControl: true,
	mapTypeControl: false,
	scaleControl: true,
	streetViewControl: false,
	rotateControl: true,
	fullscreenControl: true
};

// const onLoad = (polygon) => {
// 	console.log("polygon: ", polygon);
// };

const MapPage = ({ mapArray }) => {
	const [paths, setPaths] = useState([]);
	const [center, setCenter] = useState({});

	useEffect(() => {
		console.log();
		setCenter(
			mapArray[Number(mapArray.length / 2).toFixed(0)]?.map_geo_poins[0]
		);
	}, [mapArray]);

	useEffect(() => {
		const onlyPaths = mapArray.map((data, i) => {
			return { path: data.map_geo_poins };
		});
		setPaths(onlyPaths);
	}, [mapArray]);

	return (
		<LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={center}
				mapTypeId={"satellite"}
				zoom={12.5}
				disableDefaultUI={true}
				options={MapOptions}
			>
				{paths &&
					paths.map((data, i) => {
						return (
							<PolygonF
								key={i}
								options={options}
								// onLoad={onLoad}
								paths={data.path}
							/>
						);
					})}
			</GoogleMap>
		</LoadScript>
	);
};

export default MapPage;
