import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import logo from "../logo/logoIcon.png";


function Login({ handleSetUser, signUp }) {
  const [userData, setUserData] = useState({
    username: "",
    favAnimal: ""
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const history = useHistory();

  useEffect(() => {
    fetch("https://guarded-hollows-05759.herokuapp.com/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
    });
  }, []);

  const handleChange = event => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value
    });
  }
  const handleSubmit = event => {
    event.preventDefault();

    //if they're signing up for an account
    if (signUp){
      const checkUsers = users.findIndex(user => user.username === userData.username);
      //checks the registered users to see if their name is available
      if (checkUsers === -1){
        fetch("https://guarded-hollows-05759.herokuapp.com/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        })
        .then(res => res.json())
        .then(data => {
          localStorage.setItem("journalUser", JSON.stringify(data));
          handleSetUser(data);
          history.push("/");
        });
      }
      else {
        //tell user their name is already taken
        setError("Sorry, that username is already taken.");
      }
    }

    //user is logging in
    else {
      //check the registered users to see if their username is typed correctly
      const checkUsers = users.find(user => user.username === userData.username);

      //their username is typed correctly
      if (checkUsers){
        //check if their "password" (fav animal) matches the user we found
        const favAnimal = checkUsers.favAnimal === userData.favAnimal;

        if (favAnimal){
          localStorage.setItem("journalUser", JSON.stringify(userData));
          handleSetUser(userData);
          history.push("/");
        }

        else {
          setError("Password is not in database");
        }
      }

      //their username wasn't found in our users database
      else{
        setError("Username is not in database.");
      }
    }
  }

  const handleSignUp = signUp => {
    if (signUp) return (
      <>
      <br/>
        Already have an account? <button> <Link to="/Login" style={{ textDecoration: 'none', color: "inherit" }}>Log In</Link> </button>
      </>
    );
    else return (
      <>
       <br/>
        Don't have an account yet?  <button> <Link to="/SignUp" style={{ textDecoration: 'none', color: "inherit"}}>Sign Up</Link> </button>
      </>
    );
  }

  return (
    <div id="loginContainer">
      <div id="loginContent">
        <img id="logoLogin" src={logo} alt="logo"/>
        <form onSubmit={handleSubmit}>
          <div id="inputContainer">
            <input className="inputBox" type="text" name="username" value={userData.username} onChange={handleChange} placeholder="Enter Username..."></input>
            <input className="inputBox" type="text" name="favAnimal" value={userData.favAnimal} onChange={handleChange} placeholder="Enter Password..."></input>
          </div>
          <br/>
          <br/>
          <button className="btn1">{signUp ? "Sign Up" : "Log In"}</button>
        </form>
        <div style={{ textAlign: "center",borderTop: "1px solid",paddingTop:"15px"}} className="btn2">
          {error ? error : null}
          {handleSignUp(signUp)}
        </div>
      </div>
    </div>
  )
}

export default Login;