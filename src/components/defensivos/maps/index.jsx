import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { PolygonF } from "@react-google-maps/api";
import { useEffect } from "react";
import { useState } from "react";

const containerStyle = {
	width: "100%",
	height: "65vh"
};

// const onLoad = (polygon) => {
// 	console.log("polygon: ", polygon);
// };

const MapPage = ({ mapArray, filtData }) => {
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
		mapTypeId: "terrain"
	};

	useEffect(() => {
		const newArrParcelas = filtData.cronograma.map((data) => data.parcela);
		setParcelasApp(newArrParcelas);
	}, [filtData]);

	useEffect(() => {
		// const centerId = mapArray[0]?.map_centro_id;
		// if (centerId) {
		// 	setCenter(centerId);
		// } else {
		// 	setCenter(
		// 		mapArray[Number(mapArray.length / 2).toFixed(0)]
		// 			?.map_geo_poins[0]
		// 	);
		// }
		const mapZoom = mapArray[0]?.map_zoom;
		// console.log(mapZoom)
		if (mapZoom) {
			setZoomMap(mapZoom);
		} else {
			setZoomMap(13.6);
		}
	}, [mapArray]);

	useEffect(() => {
		let latArr = [];
		let lngArr = [];
		const onlyPaths = mapArray.map((data, i) => {
			data.map_geo_poins.forEach((element) => {
				latArr.push(Number(element.lat));
				lngArr.push(Number(element.lng));
			});
			return {
				path: data.map_geo_poins,
				color: "white",
				parcela: data.parcela,
				variedadeColor: data.variedadeColor,
				variedadeColorLine: data.variedadeColorLine
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
	}, [mapArray]);

	useEffect(() => {
		const updateColorArray = paths.map((data) => {
			const newColor = parcelasApp.includes(data.parcela)
				? data.variedadeColor
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

	return isLoaded && center ? (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={center}
			mapTypeId={"satellite"}
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
								fillColor: data.color,
								fillOpacity: 0.6,
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
	) : (
		<></>
	);
};

export default MapPage;
