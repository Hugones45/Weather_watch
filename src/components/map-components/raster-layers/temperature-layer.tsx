import { useEffect } from "react"

type TemperatureLayerProps = {
    map: mapboxgl.Map,
    isReady: boolean
}

const TemperatureLayer = ({ map, isReady }: TemperatureLayerProps) => {

    useEffect(() => {

        if (!map || !isReady) return

        const keyLayer = "temp_layer"
        const keySource = "temp_source"

        if (!map.getSource(keySource)) {
            map.addSource(keySource, {
                type: "raster",
                tiles: [`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_KEY}`],
                tileSize: 256
            })

            map.addLayer({
                id: keyLayer,
                type: 'raster',
                source: keySource
            })
        }

        return () => {
            if (map.getLayer(keyLayer)) {
                map.removeLayer(keyLayer)
            }
            if (map.getSource(keySource)) {
                map.removeSource(keySource)
            }
        }

    }, [map, isReady])

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
                Temperatur, °C
            </div>

            <div
                style={{
                    height: 12,
                    background:
                        'linear-gradient(to right, rgb(159, 85, 181) 0%, rgb(44, 106, 187) 8.75%, rgb(82, 139, 213) 12.5%, rgb(103, 163, 222) 18.75%, rgb(142, 202, 240) 25%, rgb(155, 213, 244) 31.25%, rgb(172, 225, 253) 37.5%, rgb(194, 234, 255) 43.75%, rgb(255, 255, 208) 50%, rgb(254, 248, 174) 56.25%, rgb(254, 232, 146) 62.5%, rgb(254, 226, 112) 68.75%, rgb(253, 212, 97) 75%, rgb(244, 168, 94) 82.5%, rgb(244, 129, 89) 87.5%, rgb(244, 104, 89) 93.75%, rgb(244, 76, 73) 100%)',
                    borderRadius: 4,
                    marginBottom: 4,
                }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>-40</span>
                <span>-20</span>
                <span>0</span>
                <span>20</span>
                <span>40</span>
            </div>
        </div>
    )
}

export default TemperatureLayer