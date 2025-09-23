import {
	GoogleMap,
	useJsApiLoader,
	Marker,
	InfoWindowF,
} from "@react-google-maps/api";
import { PolygonF } from "@react-google-maps/api";
import { useState, useEffect, useMemo } from "react";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";

import styles from "./produtividade.module.css";

import { useTheme, Box } from "@mui/material";
import { tokens } from '../../../theme'
import MapResumePage from "./map-page-resume";

// const svgMarker = {
// 	path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
// 	fillColor: "blue",
// 	fillOpacity: 0.6,
// 	strokeWeight: 0,
// 	rotation: 0,
// 	scale: 2
// };

const containerStyle = {
	width: "100%",
	height: "100%",
	borderRadius: "8px",
	position: "relative" // Ensures child absolute positioning works
};

const tableStyles = {
	position: "absolute", // Position it over the map
	top: "15px",
	left: "15px",
	backgroundColor: "rgba(255, 255, 255, 0.6)", // White with 70% opacity
	// padding: "20px",
	borderRadius: "8px",
	boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)",
	// height: "300px",
	zIndex: 1000, // Ensure it's above the map
	backdropFilter: "blur(10px)" // Optional: Adds a blur effect to the background
};

const MapPage = ({
	mapArray,
	filtData,
	totalSelected,
	setTotalSelected,
	handleSUm,
	printPage,
	showVarOrArea,
	showAsPlanned,
	setShowAsPlanned,
	showResumeMap,
	parcelasSelected,
	toggleParcela
}) => {

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

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
		console.log('d map: ', e)
		const djangoId = e.data.data.plantio_id
		console.log('djamgoID', djangoId)
		console.log("filtData", filtData)
		const getFIlters = filtData.find((data) => data.id === djangoId)
		console.log('getFIlters', getFIlters)
		// console.log('getFIlters', getFIlters)
		if (getFIlters) {
			toggleParcela(getFIlters.id_farmbox)
		}
		// setMarkerList((prev) => [
		// 	...prev,
		// 	{ lat: d.latLng.lat(), lng: d.latLng.lng(), data: e }
		// ]);
		// console.log(markerList);
		// handleSUm({
		// 	parcela: e.parcela,
		// 	area: e.data.data.area_colheita
		// });
		// const msg = `${e.parcela} - ${e.data.data.area_colheita.toLocaleString(
		// 	"pt-br",
		// 	{
		// 		minimumFractionDigits: 2,
		// 		maximumFractionDigits: 2
		// 	}
		// )} - ${e.data.data.variedade}`;
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

	const [resumeContainerData, setResumeContainerData] = useState([]);


	useEffect(() => {
		if (mapArray?.length > 0) {
			if (parcelasSelected.length > 0) {
				const filterSelectedparcelas = filtData.filter((data) => parcelasSelected.includes(data.id_farmbox))
				const onlyFarmId = filterSelectedparcelas.map((data) => data.id)
				const groupedData = Object.values(
					mapArray.filter((data) => onlyFarmId.includes(data.dados.plantio_id)).reduce((acc, curr) => {
						const key = `${curr.dados.cultura}-${curr.dados.variedade}`;
						if (!acc[key]) {
							acc[key] = {
								cultura: curr.dados.cultura,
								variedade: curr.dados.variedade,
								total_area_colheita: 0,
							};
						}
						acc[key].total_area_colheita += curr.dados.area_colheita;
						return acc;
					}, {})
				);
				setResumeContainerData(groupedData)

			} else {

				const groupedData = Object.values(
					mapArray.reduce((acc, curr) => {
						const key = `${curr.dados.cultura}-${curr.dados.variedade}`;
						if (!acc[key]) {
							acc[key] = {
								cultura: curr.dados.cultura,
								variedade: curr.dados.variedade,
								total_area_colheita: 0,
							};
						}
						acc[key].total_area_colheita += curr.dados.area_colheita;
						return acc;
					}, {})
				);
				setResumeContainerData(groupedData)
			}
		}
	}, [mapArray, parcelasSelected]);





	// const MapOptions = {
	// 	// disableDefaultUI: true
	// 	zoomControl: true,
	// 	mapTypeControl: false,
	// 	scaleControl: true,
	// 	streetViewControl: false,
	// 	rotateControl: true,
	// 	fullscreenControl: true,
	// 	scrollwheel: false,
	// 	zoom: zoomMap,
	// 	mapTypeId: "satellite"
	// }
	const MapOptions = useMemo(() => ({
		// disableDefaultUI: true
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: true,
		streetViewControl: false,
		rotateControl: true,
		fullscreenControl: true,
		scrollwheel: false,
		zoom: zoomMap,
		mapTypeId: "satellite"
	}), [zoomMap])


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
			// if (centerId) {
			// 	setCenter(centerId);
			// } else {
			// 	setCenter(
			// 		mapArray[Number(mapArray.length / 2).toFixed(0)]?.dados
			// 			?.map_geo_points[0]
			// 	);
			// }
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
			let latArr = [];
			let lngArr = [];
			const onlyPaths = mapArray.map((data, i) => {
				// console.log(data);
				let latLong = [];
				if (data.dados.map_geo_points) {
					latLong = data.dados.map_geo_points.map((data) => {
						latArr.push(Number(data.latitude));
						lngArr.push(Number(data.longitude));
						return {
							lat: Number(data.latitude),
							lng: Number(data.longitude)
						};
					});
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
			const getCenterLat = latArr.sort((a, b) => b - a);
			const calCenterlat =
				(getCenterLat[0] + getCenterLat[getCenterLat.length - 1]) / 2;

			const getCenterLng = lngArr.sort((a, b) => b - a);
			const calCenterlng =
				(getCenterLng[0] + getCenterLng[getCenterLng.length - 1]) / 2;
			const centerDict = { lat: calCenterlat, lng: calCenterlng };
			setCenter(centerDict);
			setPaths(onlyPaths);
		}
	}, [mapArray]);

	useEffect(() => {
		const updateColorArray = paths.map((data) => {

			// console.log('pathData', data);
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
		// console.log('data inside', data.variedade)
		const getColor = (variedadeInside, colorInside) => {
			if (variedadeInside === 'Mungo Preto') {
				return '#82202B'
			}
			if (variedadeInside === 'Mungo Verde') {
				return 'rgba(170,88,57,1.0)'
			}
			if (variedadeInside === 'Caupi') {
				return '#3F4B7D'
			}
			// if (variedadeInside?.includes("424")) {
			// 	return '#FFFFCC'
			// }
			if (!variedadeInside) {
				return '#f0f0f0'
			}
			return colorInside
		}
		const getColorLine = (variedadeInside, colorInside) => {
			if (variedadeInside === 'Mungo Preto') {
				return 'rgba(170,88,57,0.7)'
			}
			if (variedadeInside === 'Mungo Verde') {
				return 'rgba(130,32,43,0.7)'
			}
			if (variedadeInside === 'Caupi') {
				return '#3F4B7D'
			}
			// if (variedadeInside?.includes("424")) {
			// 	return '#FFFFCC'
			// }
			if (!variedadeInside) {
				return '#f0f0f0'
			}
			return colorInside
		}

		if (showAsPlanned) {
			return {
				color: getColor(data.data.data.variedade, data.variedadeColor),
				stroke: data.data.data.variedade ? 0.8 : 0.3,
				lineColor: getColorLine(data.data.data.variedade, data.variedadeColorLine),
				lineStroke: data.data.data.variedade ? 1.5 : 0.5
			}
		}
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
				// color: data.color,
				// stroke: 0.8,
				// lineColor: "yellow",
				// lineStroke: 0.5
				color: getColor(data.data.data.variedade, data.variedadeColor),
				stroke: data.data.data.variedade ? 0.8 : 0.3,
				lineColor: getColorLine(data.data.data.variedade, data.variedadeColorLine),
				lineStroke: data.data.data.variedade ? 1.5 : 0.5
			};
		}

		if (data.descontinuado === true) {
			return {
				color: printPage ? "white" : "red",
				stroke: 0.3,
				lineColor: printPage ? "white" : "red",
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
		<div style={{ position: "relative", width: "100%", height: "100%" }}>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={center}
				options={MapOptions}
				onLoad={(map) => map.setZoom(zoomMap)}
			>
				{appArray &&
					appArray.map((dataF, i) => {
						const area = dataF.data.data.area_colheita.toLocaleString(
							"pt-br",
							{
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}
						);
						const variedade = dataF.data.data.variedade ? dataF.data.data.variedade : '';
						// const variedade = dataF.data.data.cultura === 'Soja' ? dataF.data.data.variedade : '';
						const finalizado =
							dataF.finalizadoPlantio && !dataF.descontinuado;
						const label = `${dataF.parcela} \n ${showVarOrArea ? area + 'ha' : variedade}`;
						// const label = `${dataF.parcela} \n marce`;
						const newLabel = {
							text: finalizado ? label : label,
							color: finalizado ? "white" : "black",
							className: styles["marker-label"]
						};

						const djangoId = dataF.data.data.plantio_id
						const getFIlters = filtData.find((data) => data.id === djangoId)
						// console.log('getFIlters', getFIlters)
						let isSelected;
						if (getFIlters) {
							const filtered = parcelasSelected.filter((data) => data === getFIlters?.id_farmbox)
							isSelected = filtered.length > 0 ? true : false
						} else {
							isSelected = false
						}
						// console.log('data check: ', dataF)
						// console.log("dataArray: ", parcelasSelected)
						return (
							<>
								<PolygonF
									key={i}
									options={{
										fillColor: getColorStroke(dataF).color,
										fillOpacity: isSelected ? 0.3 : getColorStroke(dataF).stroke,
										strokeColor:
											isSelected ? "blue" : getColorStroke(dataF).lineColor,
										strokeOpacity: 1,
										strokeWeight: isSelected ? 1 : 
											getColorStroke(dataF).lineStroke,
										clickable: true,
										draggable: false,
										editable: false,
										geodesic: false,
										zIndex: 1
									}}
									onClick={(e) => handleClick(e, dataF)}
									// onLoad={onLoad}
									paths={dataF.path}
								/>
								<Marker
									optimized={true}
									label={finalizado ? newLabel : newLabel}
									icon={"."}
									InfoWindowShown={true}
									position={dataF.data.data.map_geo_points_center}
								></Marker>
							</>
						);
					})}

				{markerList &&
					markerList.map((data, i) => {
						console.log(data.lat, data.lng);
						return (
							<>
								<InfoWindowF
									open={true}
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
											<div>
												{data.data.data.data.variedade}
											</div>
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
							</>
						);
					})}
			</GoogleMap>
			{/* Table Container */}
			{showResumeMap &&
				<Box sx={tableStyles}>
					<MapResumePage data={resumeContainerData} />
				</Box>
			}
			<div style={{ position: "absolute", bottom: 90, right: 10, display: "flex", flexDirection: "column", gap: 12, zIndex: 100 }}>
				<button
					onClick={() => setZoomMap((z) => z + 0.4)}
					style={{
						width: 40,
						height: 40,
						lineHeight: "32px",
						textAlign: "center",
						fontSize: 18,
						background: "#fff",
						border: "1px solid #d9d9d9",
						borderRadius: '50%',
						boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
						cursor: "pointer",
						userSelect: "none"
					}}
					onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
					onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
				>
					+
				</button>

				<button
					onClick={() => setZoomMap((z) => z - 0.4)}
					style={{
						width: 40,
						height: 40,
						lineHeight: "32px",
						textAlign: "center",
						fontSize: 18,
						background: "#fff",
						border: "1px solid #d9d9d9",
						borderRadius: '50%',
						boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
						cursor: "pointer",
						userSelect: "none"
					}}
					onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
					onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
				>
					–
				</button>
			</div>
		</div>
	) : (
		<></>
	);
};

export default MapPage;
