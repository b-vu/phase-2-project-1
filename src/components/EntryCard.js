import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";

function EntryCard({ entry, user }) {
  const [likes, setLikes] = useState(entry.likes);

  const handleLikesClick = () => {
    if(user){
      fetch(`https://guarded-hollows-05759.herokuapp.com/journals/${entry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes: ++entry.likes
        })
      })
      .then(res => res.json())
      .then(data => setLikes(data.likes));
    }
    
    else{
      return null;
    }
  }

  return (
      <div className="card">
        <img id="cardImg" src={entry.img} alt={entry.title} />
        <div className="card_details">
          <span className="tag">{entry.mood}</span>


          <div class="name" style={{textAlign: "center"}}>
            {entry.title}
            <div className='card-author'>
              by {entry.author}
            </div>
          </div>
          <div className="date" style={{textAlign: "center"}}>{new Date(entry.date).toLocaleString()}</div>

          <Link to={`/Entry/${entry.id}`} style={{ textDecoration: 'none' }}>
            <button className="more-button">Read more</button>
          </Link>
         <p className="card-heart" onClick={() => handleLikesClick()}>❤️ {likes}</p>
        </div>
      </div>
  )
}

export default EntryCard


