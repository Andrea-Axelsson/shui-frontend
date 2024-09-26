import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Messages = ({allMessages}) => {

  const [editId, setEditId] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc')

    // Sortera meddelandena beroende på sortOrder
    const sortMessages = (messages) => {
      return messages.slice().sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
  
        if (sortOrder === 'desc') {
          return dateB - dateA; // Nyast först
        } else {
          return dateA - dateB; // Äldst först
        }
      });
    };

    const toggleSortOrder = () => {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    };

  const [displayAllMessages, setDisplayAllMessages] = useState(true)
  const [displayUserMessages, setDisplayUserMessages] = useState(false)

  function allMessageClick(){
    setDisplayAllMessages(true)
    setDisplayUserMessages(false)

    console.log("all messages", displayAllMessages)
    console.log("user messages", displayUserMessages)
    window.location.reload();
  }
  
  function userMessageClick(){
    setDisplayAllMessages(false)
    setDisplayUserMessages(true)

    console.log("all messages", displayAllMessages)
    console.log("user messages", displayUserMessages)
  }


  const [updateMessage, setUpdateMessage] = useState('');
  const [error, setError] = useState(null); // För att hantera fel
  const [success, setSuccess] = useState(null);

  const [inputUsername, setInputUsername] = useState(''); // För att hantera användarens input i fältet
  const [userMessages, setUserMessages] = useState([]); // För att lagra användarens meddelanden

  const handleMessageUsernameChange = (event) => {
    setInputUsername(event.target.value);
  };

  const handleMessageChange = (event) => {
    setUpdateMessage(event.target.value);

  };



/* USERNAME MESSAGE */

  const handleUsernameSubmit = async (event) => {
    event.preventDefault(); // Förhindrar att sidan laddas om
    console.log('Meddelande skickat:', inputUsername);
   
    const payload = {
      username: inputUsername
    }

    const url = `https://aw49ah61z9.execute-api.eu-north-1.amazonaws.com/api/user-message?username=${encodeURIComponent(payload.username)}`;

    try{
      const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
      }
      })

      if(!response.ok){
        const errorData = await response.json()
        throw new Error(errorData.message || 'Något gick fel')
      }

      const data = await response.json()
      console.log('Svar från API:', data)

      setUserMessages(data.messages); // Uppdatera med användarens meddelanden
      setInputUsername(''); // Töm inputfältet efter submit
      userMessageClick()

      /* window.location.reload(); */
      
    }catch(error){
      console.error('Fel vid skickande:', error)
      setError(error.message)
    }
  };

  console.log("messageUsername", userMessages)
/* UPDATE MESSAGE */

  const handleSubmit = async (event) => {
    event.preventDefault(); // Förhindrar att sidan laddas om
    console.log('Meddelande skickat:', updateMessage);
   
    const payload = {
      message: updateMessage
    }

    try{
      const response = await fetch(`https://aw49ah61z9.execute-api.eu-north-1.amazonaws.com/api/messages/${editId}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
      })

      if(!response.ok){
        const errorData = await response.json()
        throw new Error(errorData.message || 'Något gick fel')
      }

      const data = await response.json()
      console.log('Svar från API:', data)
      setSuccess('Meddelandet skickades framgångsrikt!')
      setUpdateMessage('')

      window.location.reload();
      
    }catch(error){
      console.error('Fel vid skickande:', error)
      setError(error.message)
    }

  };

function editMessage(id){
  if(id === editId){
    setEditId(null)
  }else{
    setEditId(id)
  }
  
  console.log("Button clicked", editId)
}


  return (
    
    <section className='container'>
      <button onClick={toggleSortOrder}>
        Sortera efter {sortOrder === 'desc' ? 'äldst först' : 'nyast först'}
      </button>
      <button onClick={()=> allMessageClick()}>Alla meddelanden</button>

<form onSubmit={handleUsernameSubmit}>
      
        <input
          type="text"
          value={inputUsername}
          onChange={handleMessageUsernameChange}
          placeholder="username"
        />
      <button type="submit">Submit</button>
      {error && <p style={{ color: 'red' ,margin: '0 20px' }}>{error}</p>}
              
    </form>

        {displayAllMessages ? sortMessages(allMessages).map((singleMessage) => (
            <div key={singleMessage.id}>
              <article  className='message-container'>
                <p className='date'>{singleMessage.createdAt}</p>
                <p className='message'>{singleMessage.message}</p>
                <p className='user-name'>-{singleMessage.username}</p>
                <p onClick={()=> editMessage(singleMessage.id)} className='edit-btn'>Edit</p>
              </article>
              
                {editId === singleMessage.id && 
                <form className="update-post-form" onSubmit={handleSubmit}>
                <textarea
                  className='update-post-textarea'
                  id="message"
                  value={updateMessage}
                  onChange={handleMessageChange}
                  rows="5"
                  cols="33"
                  placeholder="Skriv ditt meddelande här..."
                />
                <div className='button-container'>
                <button className='update-post-button' type="submit">Publicera</button>
                <i onClick={()=> editMessage(singleMessage.id)} className="fa-solid fa-x"></i>
                </div>
                {error && <p style={{ color: 'red' ,margin: '0 20px' }}>{error}</p>}
                </form>
                
                }
                
          </div>
        ))
      :sortMessages(userMessages).map((singleUserMessage) => (
        <div key={singleUserMessage.id}>
              <article  className='message-container'>
                <p className='date'>{singleUserMessage.createdAt}</p>
                <p className='message'>{singleUserMessage.message}</p>
                <p className='user-name'>-{singleUserMessage.username}</p>
                <p onClick={()=> editMessage(singleUserMessage.id)} className='edit-btn'>Edit</p>
              </article>
              
                {editId === singleUserMessage.id && 
                <form className="update-post-form" onSubmit={handleSubmit}>
                <textarea
                  className='update-post-textarea'
                  id="message"
                  value={updateMessage}
                  onChange={handleMessageChange}
                  rows="5"
                  cols="33"
                  placeholder="Skriv ditt meddelande här..."
                />
                <div className='button-container'>
                <button className='update-post-button' type="submit">Publicera</button>
                <i onClick={()=> editMessage(singleUserMessage.id)} className="fa-solid fa-x"></i>
                </div>
                {error && <p style={{ color: 'red' ,margin: '0 20px' }}>{error}</p>}
                </form>
                
                }
                
          </div>
      ))
      }
        <Link to="/new-message">
        <div className='add-post-btn'>
        <i className="fa-solid fa-pen"></i>
        </div>
        </Link>
        
    </section>
  )
}

export default Messages