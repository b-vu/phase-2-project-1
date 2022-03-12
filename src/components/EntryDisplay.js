import React, { useState, useEffect } from "react";
import EntryCard from "./EntryCard";
import { fadeInUp } from "react-animations"
import styled, { keyframes } from "styled-components";

const moodArray = ["💭 All", "😊 Happy", "😣 Tired", "😥 Sad", "🤩 Excited", "🥰 Loved", "😖 Stressed"]

function EntryDisplay({ user, handleSetUser }) {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isDescending, setIsDescending] = useState(true);

  const FadeInUp = styled.div`animation: 2s ${keyframes`${fadeInUp}`}`;

  useEffect(() => {
    const userStatus = JSON.parse(localStorage.getItem("journalUser"));
    fetch("https://guarded-hollows-05759.herokuapp.com/journals")
      .then(res => res.json())
      .then(data => {
        setEntries(data)
        handleSetUser(userStatus);
      });
  }, []);

  useEffect(() => {
    handleNewest(entries);
  }, [entries])

  //Date Order Functions
  const handleNewest = (e, array = entries) => {
    setIsDescending(!isDescending)  
    array.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      })
    }

  const handleOldest = (e, array = entries) => {
    setIsDescending(!isDescending)  
    array.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    }) 
  }


  // Filter Mood Functions
  const handleFilterChange = event => {
    setFilter(event.target.value);
  }

  const renderFilteredEntries = filter => {
    if (filter === "All") return entries.map(entry => <EntryCard key={entry.id} entry={entry} user={user}></EntryCard>);

    else if (filter === "Your Entries") {
      const filteredEntries = entries.filter(entry => entry.author === user.username);
      return filteredEntries.map(entry => <EntryCard key={entry.id} entry={entry} user={user}></EntryCard>);
    }

    const filteredEntries = entries.filter(entry => {
      return entry.mood === filter
    });
    return filteredEntries.map(entry => <EntryCard key={entry.id} entry={entry} user={user}></EntryCard>);
  }

  const moodList = moodArray.map(mood =>
    <button key={mood} id="moodFilter" value={mood.substring(3, mood.length)} onClick={handleFilterChange} >
      {mood}
    </button>);

  return (
    <div id="entryContainer">
      <h1 id="homePage">Thought Bubbles</h1>
      <div id="filterContainer">
        {user ? <button id="moodFilter" value="Your Entries" onClick={handleFilterChange} key="1"> ✏️ Your Entries</button> : null}
        {moodList}
        <button  onClick={handleNewest} value="descending">⏳ Newest Bubbles</button>
        <button onClick={handleOldest} value="ascending"> ⌛️ Oldest Bubbles</button>
      </div>

      <FadeInUp>
        <div id="container">
          {renderFilteredEntries(filter)}
        </div>
      </FadeInUp>
    </div>
  )
}

export default EntryDisplay;
