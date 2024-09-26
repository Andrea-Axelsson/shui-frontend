import Messages from "./pages/Messages"
import React, { useEffect, useState } from 'react';
import Newmessage from "./pages/Newmessage";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


function App() {

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)


  useEffect(() =>{
    fetch('https://aw49ah61z9.execute-api.eu-north-1.amazonaws.com/api/messages')
    .then(response => {
      if(!response.ok){
        throw new Error('Network response was not okay')
      }
      return response.json()
    })
    .then(data =>{
      setData(data)
    })
    .catch(error => {
      setError(error)
    })
  }, [])

  if(error){
    return <p>Något gick fel: {error.message}</p>
  }

  if (!data) {
    return <p>Laddar...</p>;
  }
  
  return (
    <section className="background">
    <Router>
      <Routes>
      
        <Route path="/" element={
        <Messages
        allMessages={data.messages}
        />}/>
        <Route path="/new-message" element={<Newmessage/>}/>
      
      </Routes>
    </Router>
    </section>
  )
}

export default App

/* 

-Ett sökfält högst upp med knapp där man kan söka efter specifik användare.
-En knapp som hämtar alla meddelanden.

-Om allMessages är true, så visas alla. (allMessages börjar alltid som true.)
-Om userMessage är true så visas dom. 
-Dom kan inte vara true samtidigt

*/
