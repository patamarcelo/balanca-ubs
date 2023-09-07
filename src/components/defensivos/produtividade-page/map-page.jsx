import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { PolygonF } from "@react-google-maps/api";
import { useEffect } from "react";
import { useState } from "react";

const containerStyle = {
	width: "100%",
	height: "100%",
	borderRadius: "8px"
};

// const onLoad = (polygon) => {
// 	console.log("polygon: ", polygon);
// };

const MapPage = ({ mapArray, filtData }) => {
	const handleClick = (e) => {
		console.log(e);
		const msg = `${e.parcela} - ${e.data.data.area_colheita.toLocaleString(
			"pt-br",
			{
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}
		)} - ${e.data.data.variedade}`;
		window.alert(msg);
	};
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
	});

	const [paths, setPaths] = useState([]);
	const [center, setCenter] = useState({});
	const [parcelasApp, setParcelasApp] = useState([]);
	const [appArray, setAppArray] = useState([]);
	const [zoomMap, setZoomMap] = useState();

	const MapOptions = {
		// disableDefaultUI: true
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: true,
		streetViewControl: false,
		rotateControl: true,
		fullscreenControl: true,
		scrollwheel: false,
		zoom: zoomMap,
		mapTypeId: "satellite"
	};

	useEffect(() => {
		if (filtData) {
			const newArrParcelas = filtData.map(
				(data) => data.talhao__id_talhao
			);
			setParcelasApp(newArrParcelas);
		}
	}, [filtData]);

	useEffect(() => {
		const centerId = mapArray[0]?.dados?.projeto_map_centro_id;
		if (centerId) {
			setCenter(centerId);
		} else {
			setCenter(
				mapArray[Number(mapArray.length / 2).toFixed(0)]
					?.map_geo_poins[0]
			);
		}
		const mapZoom = mapArray[0]?.dados?.projeto_map_zoom;
		// console.log(mapZoom)
		if (mapZoom) {
			setZoomMap(mapZoom);
		} else {
			setZoomMap(13.6);
		}
	}, [mapArray]);

	useEffect(() => {
		const onlyPaths = mapArray.map((data, i) => {
			// console.log(data);
			let latLong = [];
			if (data.dados.map_geo_points) {
				latLong = data.dados.map_geo_points.map((data) => ({
					lat: Number(data.latitude),
					lng: Number(data.longitude)
				}));
			}
			return {
				data: data.dados,
				path: latLong,
				color: "white",
				finalizadoPlantio: data.dados.finalizado_plantio,
				finalizadoColheita: data.dados.finalizado_colheita,
				descontinuado: data.dados.plantio_descontinuado,
				parcela: data.parcela,
				variedadeColor: data.dados.variedade_color,
				variedadeColorLine: data.dados.variedade_color_line
			};
		});
		setPaths(onlyPaths);
	}, [mapArray]);

	useEffect(() => {
		const updateColorArray = paths.map((data) => {
			// console.log(data);
			const newColor = parcelasApp.includes(data.parcela)
				? data.variedadeColor
				: "white";
			return {
				data: data,
				finalizadoPlantio: data.finalizadoPlantio,
				finalizadoColheita: data.finalizadoColheita,
				descontinuado: data.descontinuado,
				parcela: data.parcela,
				path: data.path,
				color: newColor,
				variedadeColor: data.variedadeColor,
				variedadeColorLine: data.variedadeColorLine
			};
		});
		setAppArray(updateColorArray);
	}, [mapArray, filtData, parcelasApp, paths]);

	const getColorStroke = (data) => {
		if (
			data.finalizadoColheita === true &&
			data.finalizadoPlantio === true
		) {
			return {
				color: data.color,
				stroke: 0.4,
				lineColor: data.color,
				lineStroke: 1.5
			};
		}
		if (
			data.finalizadoPlantio === true &&
			data.finalizadoColheita === false &&
			data.descontinuado === false
		) {
			return {
				color: data.color,
				stroke: 0.8,
				lineColor: "yellow",
				lineStroke: 0.5
			};
		}

		if (data.descontinuado === true) {
			return {
				color: "red",
				stroke: 0.3,
				lineColor: "red",
				lineStroke: 1
			};
		} else {
			return {
				color: "white",
				stroke: 0.4,
				lineColor: "white",
				lineStroke: 1
			};
		}
	};

	return isLoaded && center ? (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={center}
			disableDefaultUI={true}
			options={MapOptions}
			onLoad={(map) => {
				new window.google.maps.LatLngBounds();
			}}
		>
			{appArray &&
				appArray.map((data, i) => {
					return (
						<PolygonF
							key={i}
							options={{
								fillColor: getColorStroke(data).color,
								fillOpacity: getColorStroke(data).stroke,
								strokeColor: getColorStroke(data).lineColor,
								strokeOpacity: 1,
								strokeWeight: getColorStroke(data).lineStroke,
								clickable: true,
								draggable: false,
								editable: false,
								geodesic: false,
								zIndex: 1
							}}
							onClick={() => handleClick(data)}
							// onLoad={onLoad}
							paths={data.path}
						/>
					);
				})}
		</GoogleMap>
	) : (
		<></>
	);
};

export default MapPage;
