// pages/todo.js
"use client";
// import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAppSelector } from '@/redux/hooks';
import { updateAuthDetails } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import * as stylex from '@stylexjs/stylex';
import Image from "next/image";
import { useState } from "react";

const styles = stylex.create({
  main: {
    width: "100%",
    height: "98vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10px",
    boxSizing: "border-box",
    overflow: "hidden",
    backgroundImage: "linear-gradient(to right, #2c3e50,#3c3f41,#2c3e50)",
  },
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
    width: "10%",
    cursor: "pointer",
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
    top: "35px",
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
  btn: (color) => ({
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
      default: color,
      ":active": " #fff3bfd7"
    },
    cursor: "pointer",
    opacity: {
      default: 0.8,
      ":active": 0.4
    },
    // boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
    // boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px - 20px, rgba(0, 0, 0, 0.3) 0px 30px 60px - 30px, rgba(10, 37, 64, 0.35) 0px - 2px 6px 0px inset",
    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)",
    boxShadow: `
    rgba(255, 255, 255, 0.15) 0px 1px 3px, 
    rgba(0, 0, 0, 0.3) 0px 4px 8px, 
    ${color} 0px 0px 15px -3px
  `,
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
  const authStatus: boolean = useAppSelector((state) => state.AuthReducer.authValue.isLoggedIn);
  const dispatch = useDispatch()
  const router = useRouter();
  // states
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [scoreBoard, setScoreBoad] = useState(false);

  // sounds path 
  const c1 = "/assets/sounds/c1.wav";
  const c2 = "/assets/sounds/c2.wav";
  const c3 = "/assets/sounds/c3.wav";
  const c4 = "/assets/sounds/c4.wav";

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const logout = () => {
    dispatch(updateAuthDetails({ email: "", isLoggedIn: false }));
    router.push('/');
  }

  const startGame = () => {
    setScoreBoad(true);
    playSound("/assets/sounds/start.mp3");
  }

  const playSound = (soundPath: any) => {
    const audio = new Audio(soundPath);
    audio.play();
  };

  if (authStatus) {
    return (
      <div {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.header)}>
          <h1 {...stylex.props(styles.heading)}>Simon Game</h1>
        </div>

        <div  {...stylex.props(styles.section)}>
          <div {...stylex.props(styles.topPanel(scoreBoard))}>
            {
              scoreBoard && (
                <div {...stylex.props(styles.topPanelIn)}>
                  <p>Score: <span style={{ fontWeight: "600" }}>50</span> </p>
                </div>
              )
            }
            <div {...stylex.props(styles.pf)} onClick={toggleDropdown}>
              <p>{userEmail.split("@")[0]}</p>
              {isDropdownVisible && (
                <ul {...stylex.props(styles.dropdown)}>
                  <li {...stylex.props(styles.dropdownItem)} onClick={logout}>Logout</li>
                  <li {...stylex.props(styles.dropdownItem)}>Account</li>
                  <li {...stylex.props(styles.dropdownItem)}>Settings</li>
                </ul>
              )}
            </div>
          </div>

          <div {...stylex.props(styles.centerArea)}>
            <div {...stylex.props(styles.row)}>
              <button {...stylex.props(styles.btn("rgb(211, 11, 11)"))} onClick={() => playSound(c1)} ></button>
              <button {...stylex.props(styles.btn("rgb(18, 225, 18)"))} onClick={() => playSound(c2)} ></button>
            </div>
            <div {...stylex.props(styles.row)}>
              <button {...stylex.props(styles.btn("rgb(13, 51, 222)"))} onClick={() => playSound(c3)} ></button>
              <button {...stylex.props(styles.btn("rgb(156, 186, 9)"))} onClick={() => playSound(c4)} ></button>
            </div>
          </div>

          <div  {...stylex.props(styles.bottomPanel)}>
            <div {...stylex.props(styles.bottomPanelIn)}>
              <p>00:00</p>
              <p>score:15</p>
              <p style={{ cursor: "pointer", }} onClick={startGame}>Start</p>
              <p>Push | Play</p>
              <p>Mode</p>
              <p>leaderboard</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    router.push('/');
  }
}
