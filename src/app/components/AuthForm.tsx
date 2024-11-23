// components/AuthForm.js
"use client";
import * as stylex from '@stylexjs/stylex';
import { FormEvent, useState } from 'react';
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import Loader from '../components/Loader';
import { updateAuthDetails } from '@/redux/slices/authSlice';

const styles = stylex.create({
  containerStyle: {
    width: "100%",
    height: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    padding: "15px 15px",
    width: "70%",
    height: "auto",
    maxWidth: "350px",
    boxShadow: "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px",
    fontFamily: "Roboto Mono, monospace",
  },
  headingStyle: {
    // fontSize: "1.5rem",
    // fontWeight: "bold",
    textAlign: "center",
  },
  inputStyle: (errorValue) => ({
    padding: "8px 12px",
    height: "35px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: errorValue ? "red" : "#435B66",
    fontSize: "1rem",
    borderRadius: "4px",
    width: "100%",
    boxSizing: "border-box",
    ":focus": {
      boxShadow: "0 0 5px rgba(45, 67, 86, 0.5), 0 0 10px rgba(45, 67, 86, 0.5)",
      outline: "none",
    },
    fontFamily: "Press Start 2P, system-ui"
  }),
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  errorStyle: {
    color: "red",
    fontSize: "0.875rem",
  },
  buttonStyle: {
    height: "35px",
    padding: "8px 12px",
    backgroundColor: "#2D4356",
    border: "1px solid #2D4356",
    color: "white",
    fontSize: "1rem",
    borderRadius: "4px",
    width: "100%",
    textAlign: "center",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#40534C",
    },
  },
  switchModeTextStyle: {
    // fontSize: "0.875rem",
    textAlign: "center",
    color: "#435B66",
  },
  linkStyle: {
    color: "#2D4356",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
  },
});

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const authStatus: boolean = useAppSelector((state) => state.AuthReducer.authValue.isLoggedIn);
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState({
    email: "",
    password: ""
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
      newErrors.password = "*Invalid password. Example: Abcd123#";
      hasError = true;
    }

    // Update error state
    setError(newErrors);

    if (!hasError) {
      setError({ email: "", password: "" });
      setLoading(true);
      authSubmit();
    }
  };

  const authSubmit = () => {
    dispatch(updateAuthDetails({ email: form.email, isLoggedIn: true }));
    setLoading(false);
    router.push('/main');
  }

  if (!authStatus) {
    return (
      <div {...stylex.props(styles.containerStyle)}>
        <form onSubmit={handleSubmit} {...stylex.props(styles.formStyle)}>
          <h2 {...stylex.props(styles.headingStyle)}>{mode === "login" ? "Login" : "Sign Up"}</h2>
          <div {...stylex.props(styles.inputContainer)}>
            <input
              name='email'
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              {...stylex.props(styles.inputStyle(error.email))}
            />
            {error.email && <p {...stylex.props(styles.errorStyle)}>{error.email}</p>}
          </div>

          <div {...stylex.props(styles.inputContainer)}>
            <input
              name='password'
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              {...stylex.props(styles.inputStyle(error.password))}
            />
            {error.password && <p {...stylex.props(styles.errorStyle)}>{error.password}</p>}
          </div>

          <button type="submit" {...stylex.props(styles.buttonStyle)}>
            {mode === "login" ? "Login" : "Sign Up"}
          </button>

          <p {...stylex.props(styles.switchModeTextStyle)}>
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              {...stylex.props(styles.linkStyle)}
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </span>
          </p>
        </form>

        {loading &&
          <div>
            <p>Loading</p>
            <Loader />
          </div>

        }
      </div>
    );
  } else {
    router.push('/main');
  }
};

export default AuthForm;
