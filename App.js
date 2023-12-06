import React, { useEffect, useState } from 'react';
import fetch from 'node-fetch';
import './index.css';
import { App as RealmApp, Credentials } from 'realm-web';


const App = () => {
  const [newsData, setNewsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailValidationMessage, setEmailValidationMessage] = useState('');

  const app = new RealmApp({ id: 'application-0-vjtmd' });

  const logInAnonymously = async () => {
    try {
      const user = await app.logIn(Credentials.anonymous());
      console.log('Logged in anonymously:', user);
    } catch (error) {
      console.error('Error logging in anonymously:', error);
    }
  };

  const fetchNews = async () => {
    const apiKey = 'e9677549d9ad441aaf05fc66f55cc4c2';
    const country = 'in';

    try {
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`);
      const data = await response.json();
      setNewsData(data.articles);
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  };

  useEffect(() => {
    logInAnonymously();
    fetchNews();

    const intervalId = setInterval(fetchNews, 30000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      fetchNews();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleEmailInputChange = (event) => {
    setEmailInput(event.target.value);
    setEmailValidationMessage('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = () => {
    if (validateEmail(emailInput)) {
      setSubscribeMessage(`Thank you for subscribing with email: ${emailInput}`);
      setIsSubscribed(true);
      // Additional logic for subscription if the email is valid
    } else {
      setEmailValidationMessage('Invalid email address');
      // Additional logic if the email is invalid
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Real-Time Data Journalism</h1>
      </header>
      <div className="news-container">
        {newsData.map((article, index) => (
          <div key={index} className="news-item">
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))}
      </div>
      {showModal && !isSubscribed && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Subscribe to Newsletter</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={emailInput}
              onChange={handleEmailInputChange}
            />
            {emailValidationMessage && (
              <div className="validation-message">{emailValidationMessage}</div>
            )}
            <button onClick={handleSubscribe}>Subscribe</button>
          </div>
        </div>
      )}
      {subscribeMessage && (
        <div className="subscribe-message">
          <p>{subscribeMessage}</p>
        </div>
      )}
      <footer>
        <button className="footer-button" onClick={() => setShowModal(true)}>
          Subscribe to Newsletter
        </button>
        <p>&copy; 2023 Real-Time Data Journalism</p>
      </footer>
    </div>
  );
};

export default App;