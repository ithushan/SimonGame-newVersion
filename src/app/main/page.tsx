// pages/todo.js
"use client";
// import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAppSelector } from '@/redux/hooks';
import { updateAuthDetails } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import * as stylex from '@stylexjs/stylex';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { authStateListener, getScore, isEmailVerified, storeScore } from "@/services/auth";
import Loader from "../components/Loader";
import PopUp from "./popUp";
import GameOverPopup from './gameOver';
import UpArrow from "../../../public/assets/incons/upArrow.svg";
import DownArrow from "../../../public/assets/incons/downArrow.svg";

const styles = stylex.create({
  main: (backGround) => ({
    width: "100%",
    height: "98vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10px",
    boxSizing: "border-box",
    overflow: "hidden",
    backgroundImage: backGround ? "linear-gradient(to right, #8E0E00,#1F1C18)" : "linear-gradient(to right, #2c3e50,#3c3f41,#2c3e50)",
  }),
  header: {
    width: "98%",
    height: "10%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    margin: 0,
    "@media (max-width: 768px)": {
      fontSize: "1.5rem",
    },
    padding: " 0px 10px",
    marginTop: "1rem"
  },
  heading: {
    width: "100%",
    textAlign: "center",
    color: "#fff3bfd7",
    fontSize: "3rem",
    "@media (max-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
  pf: {
    height: "50%",
    width: "auto",
    cursor: "pointer",
    padding: "3px",
    backgroundColor: "#5C8984",
    borderRadius: "4px",
    fontSize: "0.9rem",
    "@media (max-width: 768px)": {
      fontSize: "1rem",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    fontFamily: "Roboto Mono, monospace",
  },
  dropdown: {
    position: "absolute",
    top: "38px",
    right: 0,
    backgroundColor: " #5C8984",
    listStyle: "none",
    margin: 0,
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
  },
  dropdownItem: {
    textAlign: "center",
    padding: "0.5rem 1rem",
    color: "#fff3bfd7",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
    ":hover": {
      backgroundColor: "#2c3e50",
    },
  },
  section: {
    width: "100%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    padding: "15px 50px",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      padding: "0 20px",
    },
  },
  bottomPanel: {
    borderRadius: "12px",
    fontFamily: "Roboto Mono, monospace",
    fontSize: "1rem",
    backgroundColor: "#5C8984",
    opacity: 0.7,
    height: "10%",
    width: " 80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 768px)": {
      width: "100%",
      height: "auto",
      padding: "10px",
    },
  },
  bottomPanelIn: {
    width: "70%",
    display: "flex",
    gap: "10px",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  pLink: {
    cursor: "pointer",
    transition: "transform .2s",
    ":hover": {
      "transform": "scale(1.2)"
    }
  },
  centerArea: {
    paddingTop: "60px",
    borderRadius: "12px",
    height: "90%",
    width: "50%",
    display: "flex",
    gap: "15px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    "@media (max-width: 768px)": {
      width: "100%",
      height: "auto",
    },
  },
  row: {
    height: "auto",
    gap: "15px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },
  btn: (color, isActive) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "175px",
    width: "165px",
    borderRadius: "8px",
    borderStyle: "solid",
    borderWidth: "3px",
    outline: "none",
    backgroundColor: color,
    borderColor: {
      default: isActive ? "#fff3bfd7" : color,
      ":active": " #fff3bfd7"
    },
    cursor: "pointer",
    opacity: {
      default: isActive ? 0.4 : 0.8,
      ":active": 0.4
    },
    boxShadow: isActive
      ? `0 0 20px 5px ${color}, rgba(255, 255, 255, 0.5) 0px 0px 20px`
      : `rgba(255, 255, 255, 0.15) 0px 1px 3px, 
       rgba(0, 0, 0, 0.3) 0px 4px 8px, 
       ${color} 0px 0px 15px -3px`,
    "@media (max-width: 768px)": {
      height: "100px",
      width: "100px",
    },
  }),
  topPanel: (align) => ({
    width: "100%",
    height: "10%",
    display: "flex",
    alignItems: "center",
    justifyContent: align ? "space-between" : "flex-end",
  }),

  topPanelIn: {
    fontFamily: "Roboto Mono, monospace",
    fontSize: "1.5rem",
    color: "#fff3bfd7",

  }
});

export default function Todo() {
  // redux related 
  const userEmail: string = useAppSelector((state) => state.AuthReducer.authValue.email);
  const uid: string = useAppSelector((state) => state.AuthReducer.authValue.uid);
  const token: string = useAppSelector((state) => state.AuthReducer.authValue.token);
  // const authStatus: boolean = useAppSelector((state) => state.AuthReducer.authValue.isLoggedIn);

  const dispatch = useDispatch()
  const router = useRouter();
  // states
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState(false);
  const [emaiVerified, setEmailVerified] = useState<boolean | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // new game logic
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [gameOverStyle, setGameOverStyle] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);

  const [gameState, setGameState] = useState<boolean | null>(null);
  const [gameLevel, setGameLevel] = useState<number>(0);
  const [gamePattern, setGamePattern] = useState<string[]>([]);
  const [userSelectedPattern, setUserSelectedPattern] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState<number>(0);


  // sounds path 
  type Color = keyof typeof sounds;
  const colors: Color[] = ["red", "blue", "green", "yellow"];

  const sounds = {
    red: "/assets/sounds/c1.wav",
    blue: "/assets/sounds/c2.wav",
    green: "/assets/sounds/c3.wav",
    yellow: "/assets/sounds/c4.wav",
  };

  const playSound = (soundPath: any) => {
    const audio = new Audio(soundPath);
    audio.play();
  };

  const blinkButton = (color: Color) => {
    setActiveButton(color);
    playSound(sounds[color]);

    setTimeout(() => {
      setActiveButton(null);
    }, 500);
  };

  const startGame = () => {
    setIsGameOver(false);
    if (!gameState) {
      setGameState(true);
      setGameLevel(0);
      setGamePattern([]);
      setUserSelectedPattern([]);
      setMessage("Game Started!");
      nextLevel();
    }
  };

  const nextLevel = () => {
    const randomColor: Color = colors[Math.floor(Math.random() * 4)];
    setGamePattern((prevPattern) => [...prevPattern, randomColor]);
    setUserSelectedPattern([]);
    setGameLevel((prevLevel) => prevLevel + 1);
    setMessage(`Level ${gameLevel + 1}`);
    playSound(randomColor);
    blinkButton(randomColor);
  };

  const handleUserClick = async (color: Color) => {
    if (!gameState) return;

    const newUserPattern = [...userSelectedPattern, color];
    setUserSelectedPattern(newUserPattern);
    playSound(color);
    blinkButton(color);

    // Check the user's pattern
    const currentIndex = newUserPattern.length - 1;
    if (newUserPattern[currentIndex] === gamePattern[currentIndex]) {
      if (newUserPattern.length === gamePattern.length) {
        setTimeout(nextLevel, 1000);
      }
    } else {
      const oldScore = await getScore(uid)
      if(oldScore && oldScore < score){
        storeScore(uid,score); // store score database
      }
      setMessage("Game Over! Press Start to Retry.");
      setIsGameOver(true);
      setGameOverVisible(true);
      setGameState(false);
      setScore(gameLevel);
      setGameLevel(0);
      setGamePattern([]);
      playSound("/assets/sounds/wrong.wav");
      setGameOverStyle(true);
      setTimeout(() => {
        setGameOverStyle(false);
      }, 500)
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  useEffect(() => {
    setTimeout(() => {
      setGameOverVisible(false)
    }, 2500)
  }, [gameOverVisible])

  const logout = () => {
    dispatch(updateAuthDetails({
      email: "",
      uid: "",
      token: "",
      isLoggedIn: false,
    }));
    router.push('/');
  }

  useEffect(() => {
    const unsubscribe = authStateListener((user) => {
      if (user) {
        setLoading(false);
        // console.log("User logged in:", user.uid);
        if (user.uid === uid) {
          setAuthStatus(true);
        } else {
          setAuthStatus(false);
        }
      } else {
        // console.log("User signed out.");
        setAuthStatus(false);
      }
    });

    return () => unsubscribe();
  }, [uid])

  useEffect(() => {
    const checkEmailVerification = async () => {
      const result = await isEmailVerified();
      setEmailVerified(result);
      // console.log("Email verification status:", result);
    };

    // Delay the check for a smoother UX
    const timer = setTimeout(checkEmailVerification, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />
  }

  if (authStatus) {
    return (
      <div {...stylex.props(styles.main(gameOverStyle))}>
        <div {...stylex.props(styles.header)}>
          <h1 {...stylex.props(styles.heading)}>{isGameOver ? "Game Over" : "Simon Game"}</h1>
        </div>

        <div  {...stylex.props(styles.section)}>
          <div {...stylex.props(styles.topPanel(gameLevel > 0))}>
            {
              gameLevel > 0 && (
                <div {...stylex.props(styles.topPanelIn)}>
                  <p>
                    Score: <span style={{ fontWeight: "600" }}>{gameLevel}</span>
                  </p>
                </div>
              )
            }
            <div {...stylex.props(styles.pf)} onClick={toggleDropdown}>
              <p>{userEmail.split("@")[0]}
                <span>
                  <Image
                    alt="arrow"
                    src={isDropdownVisible ? UpArrow : DownArrow}
                    width={20}
                    height={20}
                  />
                </span>
              </p>
              {isDropdownVisible && (
                <ul {...stylex.props(styles.dropdown)}>
                  <li {...stylex.props(styles.dropdownItem)} onClick={logout}>Logout</li>
                  <li {...stylex.props(styles.dropdownItem)} style={{ cursor: "not-allowed" }} >Account</li>
                  <li {...stylex.props(styles.dropdownItem)} style={{ cursor: "not-allowed" }} >Settings</li>
                </ul>
              )}
            </div>
          </div>

          <div {...stylex.props(styles.centerArea)}>
            <div {...stylex.props(styles.row)}>
              <button {...stylex.props(styles.btn("rgb(211, 11, 11)", activeButton === 'red'))} onClick={() => handleUserClick('red')} ></button>
              <button {...stylex.props(styles.btn("rgb(18, 225, 18)", activeButton === 'green'))} onClick={() => handleUserClick('green')} ></button>
            </div>
            <div {...stylex.props(styles.row)}>
              <button {...stylex.props(styles.btn("rgb(13, 51, 222)", activeButton === 'blue'))} onClick={() => handleUserClick('blue')} ></button>
              <button {...stylex.props(styles.btn("rgb(156, 186, 9)", activeButton === 'yellow'))} onClick={() => handleUserClick('yellow')} ></button>
            </div>
          </div>

          <div  {...stylex.props(styles.bottomPanel)}>
            <div {...stylex.props(styles.bottomPanelIn)}>
              {/* <p>{formatTime(timeElapsed)}</p> */}
              {/* <p>score:15</p> */}
              <p {...stylex.props(styles.pLink)} onClick={startGame}>
                {isGameOver ? "Start again" : "Start"}
              </p>
              <p style={{ cursor: "not-allowed" }} {...stylex.props(styles.pLink)}  >Push | Play</p>
              <p style={{ cursor: "not-allowed" }}  {...stylex.props(styles.pLink)}  >Mode</p>
              <p {...stylex.props(styles.pLink)}  >leaderboard</p>
            </div>
          </div>
        </div>

        {
          emaiVerified === false &&
          <PopUp
            props="Please check your email to verify your account. After verifying, refresh this page to continue."
          />
        }


        {gameOverVisible &&
          <GameOverPopup
            props={`Your score set it into leaderboard : ${score}`}
          />
        }
      </div>
    );
  } else {
    router.push('/');
  }
}
