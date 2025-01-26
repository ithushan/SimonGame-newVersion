import React, { FC, useEffect, useState } from "react";
import StyleX from "@stylexjs/stylex";
import { getAllUserScores } from "@/services/auth";
import Loader from "../components/Loader";

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
    // fontFamily: "Roboto Mono, monospace",
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
    height: "45%",
    padding: "20px",
    overflowY: "hidden",
    position: "relative",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
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
    overflowX: "hidden",
  },
  button52: {
    fontSize: "0.8rem",
    marginTop: "10px",
    borderRadius: "8px",
    padding: "12px 16px",
    backgroundColor: "transparent",
    cursor: "pointer",
    border: "1px solid #2D4356",
    transition: "0.3s",
    ":hover": {
      backgroundColor: "black",
      color: "#fff3bfd7",
    },
  },
  usersNames: {
    width: "100%",
    height: "80%",
    overflowY: "auto",
    overflowX: "hidden",
    // border: "1px solid red",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "0 15px 0 0",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    scrollbarWidth: "thin",
    scrollbarColor: "#2D4356 #5C8984",
    // "::-webkit-scrollbar": {
    //   width: "8px",
    // },
    // "::-webkit-scrollbar-track": {
    //   background: "#f1f1f1",
    // },
    // "::-webkit-scrollbar-thumb": {
    //   background: " #2D4356",
    //   borderRadius: "10px",
    // },
    // "::-webkit-scrollbar-thumb:hover": {
    //   background: "#555",
    // },
  },
});

const Data = [
  {
    email: "civs@gmail.com",
    score: "100",
  },
  {
    email: "civs@gmail.com",
    score: "100",
  },
  {
    email: "civs@gmail.com",
    score: "100",
  },
  {
    email: "civs@gmail.com",
    score: "100",
  },
  {
    email: "civs@gmail.com",
    score: "100",
  },
  {
    email: "civs@gmail.com",
    score: "100",
  },
];

interface popupProps {
  // emaiVerified: boolean;
  //   props: string;
  onClose: () => void;
}

const popUp: FC<popupProps> = ({ onClose }) => {
  const [animation, setAnimation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userScoresDetails, setUserScoresDetails] = useState<
    { email: string; score: number }[]
  >([]);

  const closePopup = () => {
    setAnimation(true);
    onClose();
  };

  const fetchUsersScore = async () => {
    setLoading(true);
    const userScore = await getAllUserScores();
    if (userScore) {
      // Sort the user scores in descending order
      const sortedUserScores = userScore.sort((a:any, b:any) => b.score - a.score);
      setUserScoresDetails(sortedUserScores);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsersScore();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div {...StyleX.props(popUpStyles.popupOverlay)}>
      <div {...StyleX.props(popUpStyles.popup)}>
        <h2>Leader Board</h2>
        <div {...StyleX.props(popUpStyles.usersNames)}>
          {userScoresDetails.map((data, index) => (
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: "2",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                height: "12%",
                borderBottom: "2px solid #fff3bfd7",
              }}
              key={index}
            >
              <span>{`${index + 1}. ${data.email}`}</span>
              <span>{data.score}</span>
            </p>
          ))}
        </div>
        <button
          {...StyleX.props(popUpStyles.button52)}
          onClick={() => closePopup()}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default popUp;
