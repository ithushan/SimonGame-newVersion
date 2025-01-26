// components/AuthForm.js
"use client";
import * as stylex from "@stylexjs/stylex";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import Loader from "../components/Loader";
import { updateAuthDetails } from "@/redux/slices/authSlice";
import { signIn, signUp } from "@/services/auth";
import { AuthFormProps } from "../../../types";
import { Bounce, toast } from "react-toastify";
import Image from "next/image";
import Eye from "../../../public/assets/incons/eye.svg";
import EyeClose from "../../../public/assets/incons/eyeClose.svg";

const styles = stylex.create({
  containerStyle: {
    width: "100%",
    height: "98vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: "linear-gradient(to right, #2c3e50,#3c3f41,#2c3e50)",
  },
  formStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    padding: "15px 15px",
    width: "70%",
    height: "40%",
    maxWidth: "350px",
    boxShadow:
      "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px",
    // fontFamily: "Roboto Mono, monospace",
    backgroundColor: "#5C8984",
    opacity: 0.6,
    borderRadius: "8px",
    transition: "height 0.4s ease-in-out",
    overflow: "hidden", // Prevents content overflow during height transition
  },
  headingStyle: {
    // fontSize: "1.5rem",
    // fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    height: "10%",
  },
  inputStyle: (errorValue) => ({
    padding: "8px",
    height: "65%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: errorValue ? "red" : "#435B66",
    fontSize: "0.75rem",
    borderRadius: "4px",
    width: "100%",
    boxSizing: "border-box",
    ":focus": {
      boxShadow:
        "0 0 5px rgba(45, 67, 86, 0.5), 0 0 10px rgba(45, 67, 86, 0.5)",
      outline: "none",
    },
    fontFamily: "Press Start 2P, system-ui",
    position: "relative",
  }),
  inputContainer: {
    display: "flex",
    gap: "5px",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    height: "30%",
    position: "relative",
  },
  errorStyle: {
    color: "red",
    fontSize: "0.6rem",
    width: "100%",
    height: "20%",
  },
  buttonStyle: {
    height: "40px",
    padding: "10px 12px",
    backgroundColor: "#2D4356",
    border: "1px solid #2D4356",
    color: "white",
    fontSize: "0.7rem",
    borderRadius: "4px",
    width: "40%",
    textAlign: "center",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#2c3e50",
    },
    fontFamily: "Press Start 2P, system-ui",
  },
  switchModeTextStyle: {
    fontSize: "0.7rem",
    textAlign: "center",
    width: "100%",
    height: "10%",
    // border:"1px solid #2D4356",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  linkStyle: {
    fontSize: "0.7rem",
    color: "#2D4356",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
    paddingLeft: "8px",
    transition: "0.3s",
    ":hover": {
      color: "#fff3bfd7",
    },
  },
  forgetLink: {
    fontSize: "0.6rem",
    color: "#2D4356",
    cursor: "pointer",
    // fontWeight: "bold",
    // textDecoration: "underline",
    // paddingLeft: "8px",
    transition: "0.3s",
    ":hover": {
      color: "#fff3bfd7",
    },
  },
});

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const uid: string = useAppSelector((state) => state.AuthReducer.authValue.uid);
  // const token: string = useAppSelector((state) => state.AuthReducer.authValue.token);
  // const authStatus: boolean = useAppSelector((state) => state.AuthReducer.authValue.isLoggedIn);
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    setError((prevError) => ({
      ...prevError,
      [name]: "",
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { email, password } = form;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    const emailPattern = /\S+@\S+\.\S+/;

    const newErrors = { email: "", password: "" };
    let hasError = false;

    // Email validation
    if (!email) {
      newErrors.email = "Please Enter an email.";
      hasError = true;
    } else if (!emailPattern.test(email)) {
      newErrors.email = "*Invalid Email. Example: abc@gmail.com";
      hasError = true;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Please Enter a password.";
      hasError = true;
    } else if (!passwordPattern.test(password)) {
      if (mode === "signup") {
        newErrors.password = "*Invalid password. Example: Abcd123#";
        hasError = true;
      } else {
        hasError = false;
      }
    }

    // Update error state
    setError(newErrors);

    if (!hasError) {
      setError({ email: "", password: "" });
      authSubmit();
    }
  };

  const authSubmit = async () => {
    setLoading(true);
    if (mode === "signup") {
      const result = await signUp(form.email, form.password);
      if (result.success) {
        dispatch(
          updateAuthDetails({
            email: result.email ? result.email : "email-null",
            uid: result.uid ? result.uid : "uid-null",
            token: result.token ? result.token : "token-null",
            isLoggedIn: true,
          })
        );
        toast.success(
          "Sign-up successful! Please check your email for verification."
        );
        router.push("/main");
      } else {
        toast.error(`Sign-up failed: ${result.error}`);
      }
    } else {
      const result = await signIn(form.email, form.password);
      if (result.success) {
        dispatch(
          updateAuthDetails({
            email: result.email ? result.email : "email-null",
            uid: result.uid ? result.uid : "uid-null",
            token: result.token ? result.token : "token-null",
            isLoggedIn: true,
          })
        );
        toast.success("Sign-in successful!");
        router.push("/main");
      } else {
        toast.error(`Sign-in failed: ${result.error}`);
      }
    }

    setLoading(false);
  };

  const switchMode = () => {
    setError({ email: "", password: "" });
    setMode(mode === "login" ? "signup" : "login");
  };

  // if (!authStatus) {
  return (
    <div {...stylex.props(styles.containerStyle)}>
      <form onSubmit={handleSubmit} {...stylex.props(styles.formStyle)}>
        <h3 {...stylex.props(styles.headingStyle)}>
          {mode === "login" ? "LogIn" : "Create Account"}
        </h3>

        <div {...stylex.props(styles.inputContainer)}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            {...stylex.props(styles.inputStyle(error.email))}
          />
          {error.email && (
            <p {...stylex.props(styles.errorStyle)}>{error.email}</p>
          )}
        </div>

        <div {...stylex.props(styles.inputContainer)}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            {...stylex.props(styles.inputStyle(error.password))}
          />
          <Image
            src={showPassword ? Eye : EyeClose}
            alt="eye"
            width="30"
            height="30"
            style={{
              position: "absolute",
              top: "8px",
              right: "6px",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          />
          {error.password ? (
            <p {...stylex.props(styles.errorStyle)}>{error.password}</p>
          ) : (
            <p {...stylex.props(styles.forgetLink)}>Forget Passwoard ? </p>
          )}
        </div>

        <button type="submit" {...stylex.props(styles.buttonStyle)}>
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p {...stylex.props(styles.switchModeTextStyle)}>
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span {...stylex.props(styles.linkStyle)} onClick={switchMode}>
            {mode === "login" ? `SignUp` : `Login`}
          </span>
        </p>
      </form>

      {loading && (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
  // } else {
  //   router.push('/main');
  // }
};

export default AuthForm;
