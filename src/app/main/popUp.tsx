import React, { FC, useState } from 'react';
import StyleX from "@stylexjs/stylex";

const fadeOut = StyleX.keyframes({
    "0%": {
        transform: "scale(1)",
        opacity: 1,
    },
    "100%": {
        transform: "scale(0.85)",
        opacity: 0,
    },
});
const fadeIn = StyleX.keyframes({
    "0%": {
        transform: "scale(0.85)",
        opacity: 0,
    },
    "50%": {
        transform: "scale(1.05)",
        opacity: 0.8,
    },
    "70%": {
        transform: "scale(0.98)",
        opacity: 0.95,
    },
    "100%": {
        transform: "scale(1)",
        opacity: 1,
    },
});

const popUpStyles = StyleX.create({
    popupOverlay: {
        fontFamily: "Roboto Mono, monospace",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    popup: {
        width: "40%",
        height: "auto",
        padding: "20px",
        overflowY: "hidden",
        position: "relative",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#5C8984",
        color: "#fff3bfd7",
        opacity: "0.8",
        // animationName: isClosing ? fadeOut : fadeIn,
        animationDuration: "0.5s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "1",
        animationFillMode: "forwards",
        fontWeight: "700",
    },
});

interface popupProps {
    // emaiVerified: boolean;
    props: string;
}

const popUp: FC<popupProps> = ({ props }) => {
    const [animation, setAnimation] = useState(false);

    const closePopup = () => {
        setAnimation(true);
    }


    return (
        <div {...StyleX.props(popUpStyles.popupOverlay)}>
            <div {...StyleX.props(popUpStyles.popup)}>
                <p>{props}</p>
                {/* <button onClick={() => closePopup()}>Close</button> */}
            </div>

        </div>
    )
}

export default popUp