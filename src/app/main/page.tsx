// pages/todo.js
"use client";
// import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAppSelector } from '@/redux/hooks';
import { updateAuthDetails } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import * as stylex from '@stylexjs/stylex';

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
    border: "1px solid black"
  },
  heading: {
    width: "100%",
    height: "7%",
    textAlign: "center",
    fontSize: "2rem",
    color: "gray",
    margin: 0,
  },
  section: {
    width: "100%",
    height: "93%",
    border: "1px solid green",
    display: "flex",
    flexDirection: "row",
    gap: "15px",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  leftSidePanel: {
    border: "1px solid blue",
    height: "100%",
    width: "20%",
    boxSizing: "border-box",
  },
  centerArea: {
    border: "1px solid black",
    height: "100%",
    width: "50%",
    boxSizing: "border-box",
    display: "flex",
    gap: "15px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    border: "1px solid green",
    height: "auto",
    gap: "15px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    width: "200px",
    borderRadius: "8px",
    border: "2px solid brown",
    outline: "none",
    cursor: "pointer"
  },
  rightSidePanel: {
    border: "1px solid yellow",
    height: "100%",
    width: "20%",
    boxSizing: "border-box",
  },
});

export default function Todo() {
  const userEmail: string = useAppSelector((state) => state.AuthReducer.authValue.email);
  const authStatus: boolean = useAppSelector((state) => state.AuthReducer.authValue.isLoggedIn);
  const dispatch = useDispatch()
  const router = useRouter();

  const logout = () => {
    dispatch(updateAuthDetails({ email: "", isLoggedIn: false }));
    router.push('/');
  }

  if (authStatus) {
    return (
      <div {...stylex.props(styles.main)}>
        <h1 {...stylex.props(styles.heading)}>Simon Game</h1>
        <div  {...stylex.props(styles.section)}>
          <div  {...stylex.props(styles.leftSidePanel)}>
            <p>side panel one </p>
            <p>{userEmail}</p>
          </div>
          <div {...stylex.props(styles.centerArea)}>
            <div {...stylex.props(styles.row)}>
              <button {...stylex.props(styles.btn)}>red</button>
              <button {...stylex.props(styles.btn)}>green</button>
            </div>
            <div {...stylex.props(styles.row)}>
              <button {...stylex.props(styles.btn)}>yellow</button>
              <button {...stylex.props(styles.btn)}>blue</button>
            </div>
          </div>
          <div {...stylex.props(styles.rightSidePanel)}>
            <p>side panel two </p>
            <button
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    router.push('/');
  }
}
