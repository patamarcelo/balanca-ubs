import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { PolygonF } from "@react-google-maps/api";
import { useEffect } from "react";
import { useState } from "react";

const containerStyle = {
	width: "100%",
	height: "65vh"
};

const MapOptions = {
	// disableDefaultUI: true
	zoomControl: true,
	mapTypeControl: false,
	scaleControl: true,
	streetViewControl: false,
	rotateControl: true,
	fullscreenControl: true,
	scrollwheel: false
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
		const centerId = mapArray[0]?.map_centro_id;
		if (centerId) {
			setCenter(centerId);
		} else {
			setCenter(
				mapArray[Number(mapArray.length / 2).toFixed(0)]
					?.map_geo_poins[0]
			);
		}
	}, [mapArray]);

	useEffect(() => {
		const onlyPaths = mapArray.map((data, i) => {
			return {
				path: data.map_geo_poins,
				color: "white",
				parcela: data.parcela,
				variedadeColor: data.variedadeColor,
				variedadeColorLine: data.variedadeColorLine
			};
		});
		setPaths(onlyPaths);
	}, [mapArray]);

	useEffect(() => {
		const updateColorArray = paths.map((data) => {
			const newColor = parcelasApp.includes(data.parcela)
				? "red"
				: "white";
			return {
				path: data.path,
				color: newColor,
				variedadeColor: data.variedadeColor,
				variedadeColorLine: data.variedadeColorLine
			};
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
									strokeColor: "black",
									strokeOpacity: 0.4,
									strokeWeight: 0.5,
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
