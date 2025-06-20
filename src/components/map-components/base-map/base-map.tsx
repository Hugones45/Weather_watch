import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import TemperatureLayer from "../raster-layers/temperature-layer";
import PrecipitationLayer from "../raster-layers/precipitation-layer";
import CloudsLayer from "../raster-layers/clouds-layer";
import styles from "./base-map.styles.module.css";
import ChangeBaseMap from "../change-base-map/change-base-map";
import Winds from "../raster-layers/winds";

type WeatherLayerType = 'temperature' | 'precipitation' | 'clouds' | 'winds' | null;

const BaseMap = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const [isReady, setIsReady] = useState(false);
    const [activeLayer, setActiveLayer] = useState<WeatherLayerType>(null);
    const [baseStyle, setBaseStyle] = useState('mapbox://styles/mapbox/dark-v11');

    // Initialize map once
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-46.940186, -19.582844],
            zoom: 4,
            style: baseStyle,
            accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
            projection: 'mercator',
        });

        mapRef.current = map;

        map.on('load', () => {
            setIsReady(true);
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (mapRef.current && isReady) {
            mapRef.current.setStyle(baseStyle);
            setActiveLayer(null);
        }
    }, [baseStyle, isReady]);

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

    return (
        <>
            <div ref={mapContainerRef} style={{ height: '100vh' }} />

            {isReady && mapRef.current && (
                <ChangeBaseMap
                    map={mapRef.current}
                    isReady={isReady}
                    onStyleChange={(newStyleUrl: string) => {
                        setBaseStyle(newStyleUrl);
                        setActiveLayer(null);
                    }}
                />
            )}

            <div className={styles.container}>
                <div className={styles.buttonWrapper}>
                    <button
                        className={`${styles.button} ${activeLayer === 'temperature' ? styles.active : ''} ${styles['btn-temperature']}`}
                        onClick={() => setActiveLayer('temperature')}
                    >
                        🌡️
                    </button>
                    <span className={styles.label}>Temperature</span>
                </div>
                <div className={styles.buttonWrapper}>
                    <button
                        className={`${styles.button} ${activeLayer === 'precipitation' ? styles.active : ''} ${styles['btn-precipitation']}`}
                        onClick={() => setActiveLayer('precipitation')}
                    >
                        💧
                    </button>
                    <span className={styles.label}>Radar</span>
                </div>
                <div className={styles.buttonWrapper}>
                    <button
                        className={`${styles.button} ${activeLayer === 'clouds' ? styles.active : ''} ${styles['btn-clouds']}`}
                        onClick={() => setActiveLayer('clouds')}
                    >
                        ☁️
                    </button>
                    <span className={styles.label}>Clouds</span>
                </div>
                <div className={styles.buttonWrapper}>
                    <button
                        className={`${styles.button} ${activeLayer === 'winds' ? styles.active : ''} ${styles['btn-winds']}`}
                        onClick={() => setActiveLayer('winds')}
                    >
                        🌬️
                    </button>
                    <span className={styles.label}>Winds</span>
                </div>
            </div>

            {renderLayer()}
        </>
    );
};

export default BaseMap;
