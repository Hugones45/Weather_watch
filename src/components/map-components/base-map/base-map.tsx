import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import TemperatureLayer from "../raster-layers/temperature-layer";
import PrecipitationLayer from "../raster-layers/precipitation-layer";
import CloudsLayer from "../raster-layers/clouds-layer";
import Winds from "../raster-layers/winds";
import styles from "./base-map.styles.module.css";
import ChangeBaseMap from "../change-base-map/change-base-map";

type WeatherLayerType = 'temperature' | 'precipitation' | 'clouds' | 'winds' | null;

const layerConfigs = {
    temperature: { id: 'temp_layer', source: 'temp_source' },
    precipitation: { id: 'precipitation_layer', source: 'precipitation_source' },
    clouds: { id: 'clouds_layer', source: 'clouds_source' },
    winds: { id: 'winds_layer', source: 'winds_source' }
};

const BaseMap = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [activeLayer, setActiveLayer] = useState<WeatherLayerType>(null);
    const [styleChanged, setStyleChanged] = useState(false);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-46.940186, -19.582844],
            zoom: 4,
            style: 'mapbox://styles/mapbox/dark-v11',
            accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
            projection: 'mercator',
        });

        mapRef.current = map;

        map.on('load', () => {
            setIsReady(true);
        });

        map.on('styledata', () => {
            if (isReady) setStyleChanged(true);
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !isReady) return;

        Object.values(layerConfigs).forEach(({ id, source }) => {
            if (mapRef.current?.getLayer(id)) {
                mapRef.current.removeLayer(id);
            }
            if (mapRef.current?.getSource(source)) {
                mapRef.current.removeSource(source);
            }
        });

        if (styleChanged && activeLayer) {
            setTimeout(() => {
                setStyleChanged(false);
            }, 0);
        }
    }, [activeLayer, isReady, styleChanged]);

    const renderLayer = () => {
        if (!isReady || !mapRef.current) return null;

        switch (activeLayer) {
            case 'temperature':
                return <TemperatureLayer map={mapRef.current} isReady={isReady} />;
            case 'precipitation':
                return <PrecipitationLayer map={mapRef.current} isReady={isReady} />;
            case 'clouds':
                return <CloudsLayer map={mapRef.current} isReady={isReady} />;
            case 'winds':
                return <Winds map={mapRef.current} isReady={isReady} />;
            default:
                return null;
        }
    };

    // Array filtrado para evitar o null e corrigir erro do TypeScript
    const availableLayers: Exclude<WeatherLayerType, null>[] = ['temperature', 'precipitation', 'clouds', 'winds'];

    return (
        <>
            <div ref={mapContainerRef} style={{ height: '100vh' }} />

            {isReady && mapRef.current && (
                <ChangeBaseMap
                    map={mapRef.current}
                    isReady={isReady}
                    onStyleChange={() => setActiveLayer(null)}
                />
            )}

            <div className={styles.container}>
                {availableLayers.map((layer) => (
                    <div key={layer} className={styles.buttonWrapper}>
                        <button
                            className={`${styles.button} ${activeLayer === layer ? styles.active : ''} ${styles['btn-' + layer]}`}
                            onClick={() => setActiveLayer(layer)}
                        >
                            {layer === 'temperature' && '🌡️'}
                            {layer === 'precipitation' && '💧'}
                            {layer === 'clouds' && '☁️'}
                            {layer === 'winds' && '🌬️'}
                        </button>
                        <span className={styles.label}>
                            {layer.charAt(0).toUpperCase() + layer.slice(1)}
                        </span>
                    </div>
                ))}
            </div>

            {renderLayer()}
        </>
    );
};

export default BaseMap;
