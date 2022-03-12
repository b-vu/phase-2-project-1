import React, { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";

const moodArray = ["Happy", "Tired", "Sad", "Excited", "Loved", "Stressed"]

function Entry({ user, handleSetUser }) {
  const { id } = useParams();
  const history = useHistory()
  const [entry, setEntry] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const userStatus = JSON.parse(localStorage.getItem("journalUser"));
    fetch(`https://guarded-hollows-05759.herokuapp.com/journals/${id}`)
      .then(res => res.json())
      .then(data => {
        setEntry(data);
        handleSetUser(userStatus);
      });
  }, [id]);

  function handleDelete(e) {
    fetch(`https://guarded-hollows-05759.herokuapp.com/journals/${id}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then(() => history.push("/"));
  }

  const handleLikesClick = () => {
    if (user) {
      fetch(`https://guarded-hollows-05759.herokuapp.com/${entry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes: ++entry.likes
        })
      })
        .then(res => res.json())
        .then(data => setEntry(data));
    }

    else {
      return null;
    }
  }

  return (
    <div id="entryEdit">
      <div id="entryTitle">
        <h1>Title</h1>
        <p className="textArea">{entry.title}</p>
        <h3>Author</h3>
        <p className="textArea">{entry.author}</p>
      </div>
      <h3 style={{ textAlign: "center" }}>Today I was Feeling</h3>
      <div id="entryMood">
        <button> {entry.mood} </button>
      </div>
      <h3 style={{ textAlign: "center" }}>
        My Bubble
        <br/>
        <br/>
        <button><p className="card-heart" onClick={() => handleLikesClick()}>❤️ {entry.likes}</p></button>
      </h3>
      <div id="entryContent">
        <img id="entryImg" src={entry.img} alt={entry.title} />
        <p id="entryBubble" >{entry.text_body}</p>
      </div>

      {
        user === null || user.username !== entry.author ? null
          : <>
            <Link to={`/Entry/${entry.id}/Edit`}>
              <button style={{ textDecoration: 'none' }}>Edit</button>
            </Link>
            <button onClick={handleDelete}>Delete</button>
          </>

      }

    </div>
  )
}

export default Entry