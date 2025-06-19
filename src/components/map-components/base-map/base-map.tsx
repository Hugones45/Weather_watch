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
    const [styleChanged, setStyleChanged] = useState(false); // <-- novo

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

        // Detecta troca de estilo base
        map.on('styledata', () => {
            if (isReady) {
                setStyleChanged(true);
            }
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    // Remove todas as camadas ao trocar de estilo
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

        // Se o estilo mudou, re-renderiza camada ativa
        if (styleChanged && activeLayer) {
            setTimeout(() => {
                setStyleChanged(false); // reset
            }, 0); // esperar DOM aplicar estilo
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
                return <Winds map={mapRef.current} isReady={isReady} />
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
                    onStyleChange={() => {
                        setActiveLayer(null); // limpa visual + camada
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
