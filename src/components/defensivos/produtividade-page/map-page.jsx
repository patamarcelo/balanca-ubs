import {
	GoogleMap,
	useJsApiLoader,
	Marker,
	InfoWindowF
} from "@react-google-maps/api";
import { PolygonF } from "@react-google-maps/api";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";

import styles from "./produtividade.module.css";

const containerStyle = {
	width: "100%",
	height: "100%",
	borderRadius: "8px"
};

// const onLoad = (polygon) => {
// 	console.log("polygon: ", polygon);
// };

const MapPage = ({
	mapArray,
	filtData,
	totalSelected,
	setTotalSelected,
	handleSUm
}) => {
	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" }
	];

	const filteredIcon = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return "";
	};

	const filteredAlt = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return "";
	};

	const [markerList, setMarkerList] = useState([]);

	const handleClick = (d, e) => {
		setMarkerList((prev) => [
			...prev,
			{ lat: d.latLng.lat(), lng: d.latLng.lng(), data: e }
		]);
		console.log(markerList);
		handleSUm({
			parcela: e.parcela,
			area: e.data.data.area_colheita
		});
		const msg = `${e.parcela} - ${e.data.data.area_colheita.toLocaleString(
			"pt-br",
			{
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}
		)} - ${e.data.data.variedade}`;
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
		if (mapArray.length > 0) {
			const centerId = mapArray[0]?.dados?.projeto_map_centro_id;
			if (centerId) {
				setCenter(centerId);
			} else {
				setCenter(
					mapArray[Number(mapArray.length / 2).toFixed(0)]?.dados
						?.map_geo_points[0]
				);
			}
			const mapZoom = mapArray[0]?.dados?.projeto_map_zoom;
			// console.log(mapZoom)
			if (mapZoom) {
				setZoomMap(mapZoom);
			} else {
				setZoomMap(13.6);
			}
		}
	}, [mapArray]);

	useEffect(() => {
		if (mapArray) {
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
		}
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
							onClick={(e) => handleClick(e, data)}
							// onLoad={onLoad}
							paths={data.path}
						/>
					);
				})}

			{markerList &&
				markerList.map((data, i) => {
					return (
						<InfoWindowF
							position={{ lat: data.lat, lng: data.lng }}
							onCloseClick={() => {
								setMarkerList((prev) =>
									prev.filter(
										(dataArray) =>
											dataArray.data.data.data
												.plantio_id !==
											data.data.data.data.plantio_id
									)
								);
								console.log("clic");
							}}
						>
							<div className={styles.popUpMap}>
								<div className={styles.popUpMapInfo}>
									<div>{data.data.parcela}</div>
									<img
										style={{
											width: "15px",
											height: "15px",
											marginRight: "10px"
										}}
										src={filteredIcon(
											data.data.data.data.cultura
										)}
										alt={filteredAlt(
											data.data.data.data.cultura
										)}
									/>
								</div>
								<div className={styles.popUpMapInfoTwo}>
									<div>{data.data.data.data.variedade}</div>
									<div>
										{data.data.data.data.area_colheita.toLocaleString(
											"pt-br",
											{
												minimumFractionDigits: 2,
												maximumFractionDigits: 2
											}
										)}
									</div>
								</div>
							</div>
						</InfoWindowF>
					);
				})}
		</GoogleMap>
	) : (
		<></>
	);
};

export default MapPage;
