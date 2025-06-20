import React from "react";
import styles from "./change-base-map-.module.css";

export type ChangeBaseMapProps = {
    map: mapboxgl.Map;
    isReady: boolean;
    onStyleChange: (newStyleUrl: string) => void; // recebe a URL do novo estilo
};

const styleOptions = [
    { id: "dark-v11", label: "Dark" },
    { id: "satellite-streets-v12", label: "Satellite" },
    { id: "light-v10", label: "Light" },
    { id: "streets-v12", label: "Streets" },
    { id: "outdoors-v12", label: "Outdoors" },
];

const ChangeBaseMap = ({ isReady, onStyleChange }: ChangeBaseMapProps) => {
    if (!isReady) return null;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const styleId = event.target.id;
        const styleUrl = `mapbox://styles/mapbox/${styleId}`;
        onStyleChange(styleUrl);
    };

    return (
        <div className={styles.container}>
            <div id="menu" className={styles.menu}>
                {styleOptions.map(({ id, label }, index) => (
                    <div key={id} className={styles.option}>
                        <input
                            id={id}
                            type="radio"
                            name="rtoggle"
                            onChange={handleChange}
                            defaultChecked={index === 0} // primeira opção checada
                        />
                        <label htmlFor={id}>{label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChangeBaseMap;
