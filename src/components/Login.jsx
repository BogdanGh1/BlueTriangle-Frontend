import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const LOGIN_URL = "/api/users/login";

const Login = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      setUserData(response.data);
      if (response.data.role === "USER" ) {
        setTimeout(() => {
          navigate(`/profile/:${userData.username}`);
        }, 1000);
      }
      else {
        setTimeout(() => {
          navigate(`/verify-user`);
        }, 1000);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 401) {
        setErrMsg("Invalid Credentials");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="children">
      <section>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Conecteaza-te</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nume utilizator:</label>
          <input
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />

          <label htmlFor="password">Parola:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <button>Conectare</button>
        </form>
        <div className="loginLine">
          <p>
            Nu ai cont inca?
            <br />
            <span className="line">
              <Link to="/register">Inregistreaza-te</Link>
            </span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
