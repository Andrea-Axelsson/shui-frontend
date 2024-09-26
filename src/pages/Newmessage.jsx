import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Newmessage = () => {

    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null); // För att hantera fel
    const [success, setSuccess] = useState(null); // För att hantera framgångsmeddelanden
    const navigate = useNavigate();

    // Funktion som hanterar ändringar i textarea
    const handleMessageChange = (event) => {
      setMessage(event.target.value);

    };
    
    const handleUsernameChange = (event) => {
      setUsername(event.target.value);

    };
  
    // Funktion som hanterar form-submission (när formuläret skickas)
    const handleSubmit = async (event) => {
      event.preventDefault(); // Förhindrar att sidan laddas om
      console.log('Meddelande skickat:', message);
     
      const payload = {
        message: message,
        username: username,
      }

      try{
        const response = await fetch('https://aw49ah61z9.execute-api.eu-north-1.amazonaws.com/api/messages', {
          method: 'POST',
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
        setMessage('')
        setUsername('')

        navigate('/')
        window.location.reload();
        
      }catch(error){
        console.error('Fel vid skickande:', error)
        setError(error.message)
      }

    };

  return (
    <section className='container'>
      <form className="new-post-form" onSubmit={handleSubmit}>
          <textarea
            className='new-post-textarea'
            id="message"
            value={message}
            onChange={handleMessageChange}
            rows="5"
            cols="33"
            placeholder="Skriv ditt meddelande här..."
          />
           <input
           className='new-post-username'
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Användarnamn"
          />

          <button className='new-post-button' type="submit">Publicera</button>
       
      </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
    </section>
  )
}

export default Newmessage