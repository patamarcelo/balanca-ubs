import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { PolygonF } from "@react-google-maps/api";
import { useEffect } from "react";
import { useState } from "react";

const containerStyle = {
	width: "98%",
	height: "50vh"
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

const MapPage = ({ mapArray, filtData }) => {
	const [paths, setPaths] = useState([]);
	const [center, setCenter] = useState({});
	const [parcelasApp, setParcelasApp] = useState([]);
	const [appArray, setAppArray] = useState([]);

	useEffect(() => {
		const newArrParcelas = filtData.cronograma.map((data) => data.parcela);
		setParcelasApp(newArrParcelas);
	}, [filtData]);

	useEffect(() => {
		setCenter(
			mapArray[Number(mapArray.length / 2).toFixed(0)]?.map_geo_poins[0]
		);
	}, [mapArray]);

	useEffect(() => {
		const onlyPaths = mapArray.map((data, i) => {
			return {
				path: data.map_geo_poins,
				color: "white",
				parcela: data.parcela
			};
		});
		setPaths(onlyPaths);
	}, [mapArray]);

	useEffect(() => {
		const updateColorArray = paths.map((data) => {
			const newColor = parcelasApp.includes(data.parcela)
				? "red"
				: "white";
			return { path: data.path, color: newColor };
		});
		setAppArray(updateColorArray);
	}, [mapArray, filtData, parcelasApp, paths]);

	return (
		<LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={center}
				mapTypeId={"satellite"}
				zoom={13}
				disableDefaultUI={true}
				options={MapOptions}
			>
				{appArray &&
					appArray.map((data, i) => {
						return (
							<PolygonF
								key={i}
								options={{
									fillColor: data.color,
									fillOpacity: 0.4,
									strokeColor: "white",
									strokeOpacity: 1,
									strokeWeight: 1,
									clickable: false,
									draggable: false,
									editable: false,
									geodesic: false,
									zIndex: 1
								}}
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
