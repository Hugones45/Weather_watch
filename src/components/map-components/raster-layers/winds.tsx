import { useEffect } from "react";

type WindsProps = {
    map: mapboxgl.Map;
    isReady: boolean;
};

const Winds = ({ map, isReady }: WindsProps) => {

    useEffect(() => {
        if (!map || !isReady) return;

        const keyLayer = "winds_layer";
        const keySource = "winds_source";

        if (!map.getSource(keySource)) {
            map.addSource(keySource, {
                type: "raster",
                tiles: [`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_KEY}`],
                tileSize: 256,
            });

            map.addLayer({
                id: keyLayer,
                type: "raster",
                source: keySource,
            });
        }

        return () => {
            if (map.getLayer(keyLayer)) {
                map.removeLayer(keyLayer);
            }
            if (map.getSource(keySource)) {
                map.removeSource(keySource);
            }
        };
    }, [map, isReady]);

    return (
        <div
            style={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontFamily: 'Arial, sans-serif',
                width: 320,
                userSelect: 'none',
                zIndex: 10,
            }}
        >
            <div style={{ marginBottom: 6, textAlign: 'center', fontWeight: 'bold' }}>
                Wind Speed, m/s
            </div>

            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        fontFamily: 'Arial, sans-serif',
                        marginBottom: 4,
                        userSelect: 'none',
                        color: '#422d6d',
                    }}
                >
                    <span>0</span>
                    <span>2</span>
                    <span>3</span>
                    <span>6</span>
                    <span>12</span>
                    <span>25</span>
                    <span>50</span>
                    <span>100</span>
                </div>

                <div
                    style={{
                        height: 12,
                        borderRadius: 6,
                        background:
                            'linear-gradient(to right, ' +
                            'rgba(255, 255, 255, 1) 0%, ' +            // full white at 0
                            'rgba(170, 128, 177, 0.44) 10%, ' +        // light purple just before 2
                            'rgba(170, 128, 177, 0.54) 20%, ' +        // between 2 and 3
                            'rgba(176, 128, 177, 0.71) 30%, ' +        // around 3-6
                            'rgba(170, 128, 177, 0.84) 50%, ' +        // around 6-12
                            'rgb(164, 123, 170) 70%, ' +                // around 12-25
                            'rgba(146, 108, 199, 0.9) 90%, ' +           // 50
                            'rgba(136, 98, 188, 0.9) 100%)',                 // darkest purple at 100 (darker than before)
                    }}
                />
            </div>



        </div>
    );
};

export default Winds;
