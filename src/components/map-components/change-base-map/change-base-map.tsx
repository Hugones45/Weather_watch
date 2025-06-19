import { useEffect } from "react";
import styles from "./change-base-map-.module.css";

type ChangeBaseMapProps = {
    map: mapboxgl.Map;
    isReady: boolean;
    onStyleChange: () => void;
};

const ChangeBaseMap = ({ map, isReady, onStyleChange }: ChangeBaseMapProps) => {
    useEffect(() => {
        if (!map || !isReady) return;

        const layerList = document.getElementById("menu");
        if (!layerList) return;

        const inputs = layerList.getElementsByTagName("input");

        for (const input of inputs) {
            input.onclick = (event: any) => {
                const layerId = event.target.id;
                map.setStyle("mapbox://styles/mapbox/" + layerId);
                onStyleChange(); // limpa a camada ativa
            };
        }
    }, [map, isReady, onStyleChange]);

    return (
        <div className={styles.container}>
            <div id="menu" className={styles.menu}>
                <div className={styles.option}>
                    <input id="dark-v11" type="radio" name="rtoggle" defaultChecked />
                    <label htmlFor="dark-v11">Dark</label>
                </div>
                <div className={styles.option}>
                    <input id="standard-satellite" type="radio" name="rtoggle" />
                    <label htmlFor="standard-satellite">Satellite</label>
                </div>
                <div className={styles.option}>
                    <input id="light-v11" type="radio" name="rtoggle" />
                    <label htmlFor="light-v11">Light</label>
                </div>

                <div className={styles.option}>
                    <input id="standard" type="radio" name="rtoggle" />
                    <label htmlFor="standard">Streets</label>
                </div>
                <div className={styles.option}>
                    <input id="outdoors-v12" type="radio" name="rtoggle" />
                    <label htmlFor="outdoors-v12">Outdoors</label>
                </div>
            </div>
        </div>
    );
};

export default ChangeBaseMap;
