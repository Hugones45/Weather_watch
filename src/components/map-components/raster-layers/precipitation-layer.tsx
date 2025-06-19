import { useEffect } from "react"

type PrecipitationLayerProps = {
    map: mapboxgl.Map,
    isReady: boolean
}

const PrecipitationLayer = ({ map, isReady }: PrecipitationLayerProps) => {

    useEffect(() => {

        if (!map || !isReady) return

        const keyLayer = "precipitation_layer"
        const keySource = "precipitation_source"

        if (!map.getSource(keySource)) {

            map.addSource(keySource, {
                type: "raster",
                tiles: [`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_KEY}`],
                tileSize: 256
            })

            map.addLayer({
                id: keyLayer,
                type: "raster",
                source: keySource,
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
                Precipitation, mm/h
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                    fontWeight: 'bold',
                    color: '#333',
                }}
            >
                <span>0</span>
                <span>1</span>
                <span>4</span>
                <span>6</span>
                <span>10</span>
                <span>14</span>
                <span>16</span>
                <span>24</span>
                <span>32</span>
                <span>60</span>
            </div>

            <div
                style={{
                    height: 12,
                    borderRadius: 6,
                    backgroundImage:
                        'linear-gradient(to right, ' +
                        '#fdfdff 0%, ' +          // almost white (0)
                        '#f3f1fb 10%, ' +         // soft lavender (1)
                        '#e1e3f8 20%, ' +         // very light pastel blue (4)
                        '#d0d4f0 30%, ' +         // soft blue (6)
                        '#b0b5e6 45%, ' +         // moderate blue (10)
                        '#9e9ee0 60%, ' +         // richer tone (14)
                        '#8c89d8 70%, ' +         // deeper but not dark (16)
                        '#7a76d0 80%, ' +         // more vivid blue-violet (24)
                        '#6a65c8 90%, ' +         // vibrant tone (32)
                        '#5c57bf 100%)',          // final rich tone (60)
                }}
            />
        </div>



    )
}

export default PrecipitationLayer