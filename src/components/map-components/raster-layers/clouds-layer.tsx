import { useEffect } from "react"

type CloudsLayerPorps = {
    map: mapboxgl.Map,
    isReady: boolean
}



const CloudsLayer = ({ map, isReady }: CloudsLayerPorps) => {

    useEffect(() => {

        if (!map || !isReady) return

        const keyLayer = "clouds_layer"
        const keySource = "clouds_source"

        if (!map.getSource(keySource)) {

            map.addSource(keySource, {
                type: "raster",
                tiles: [`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_KEY}`],
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
                Clouds, %
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                    fontWeight: 'bold',
                    color: '#333',
                }}
            >
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
            </div>

            <div
                style={{
                    height: 12,
                    borderRadius: 6,
                    border: '1px solid #aaa', // subtle border for better visibility
                    backgroundImage:
                        'linear-gradient(to right, ' +
                        'rgba(247, 247, 255, 0) 0%, ' +
                        'rgba(251, 247, 255, 0) 10%, ' +
                        'rgba(244, 248, 255, 0.1) 20%, ' +
                        'rgba(240, 249, 255, 0.2) 30%, ' +
                        'rgba(221, 250, 255, 0.4) 40%, ' +
                        'rgba(224, 224, 224, 0.9) 50%, ' +
                        'rgba(224, 224, 224, 0.76) 60%, ' +
                        'rgba(228, 228, 228, 0.9) 70%, ' +
                        'rgba(232, 232, 232, 0.9) 80%, ' +
                        'rgb(214, 213, 213) 90%, ' +
                        'rgb(210, 210, 210) 95%, ' +
                        'rgb(183, 183, 183) 100%)',
                }}
            />
        </div>

    )
}

export default CloudsLayer