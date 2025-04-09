import React, { useState, useEffect } from 'react';
import './App.css';
import Flashcard from './components/Flashcard';
import SideMenu from './components/SideMenu';
import ThemeToggle from './components/ThemeToggle';
import api from './api';

const App = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSet, setCurrentSet] = useState('');
  const [sets, setSets] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [formData, setFormData] = useState({ question: '', answer: '', setName: '', questionId: '', setToChange: '', setToDelete: '' });

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions');
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Błąd podczas pobierania pytań:', error);
    }
  };

  const fetchSets = async () => {
    try {
      const response = await api.get('/sets');
      setSets(response.data.sets);
    } catch (error) {
      console.error('Błąd podczas pobierania zestawów:', error);
    }
  };

  const changeSet = async (setName) => {
    try {
      await api.post('/change_set', { set_name: setName });
      setCurrentSet(setName);
      fetchQuestions();
    } catch (error) {
      console.error('Błąd podczas zmiany zestawu:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchSets();
  }, []);

  const toggleTheme = () => setDarkTheme(!darkTheme);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCard = () => setFlipped(!flipped);
  const prevCard = () => setCurrentIndex((currentIndex - 1 + questions.length) % questions.length);
  const nextCard = () => setCurrentIndex((currentIndex + 1) % questions.length);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={darkTheme ? 'dark-theme' : ''}>
      <div className="current-set-container">
        <p className="current-set">Current set: {currentSet}</p>
      </div>

      <div className="flashcard-container">
        <button id="button_prev" className="material-icons" onClick={prevCard}>chevron_left</button>
        <Flashcard
          question={questions[currentIndex]?.question}
          answer={questions[currentIndex]?.answer}
          flipped={flipped}
          toggleCard={toggleCard}
        />
        <button id="button_next" className="material-icons" onClick={nextCard}>chevron_right</button>
      </div>

      <button id="menu-button" className="material-icons" onClick={toggleMenu}>menu</button>
      <SideMenu
        menuOpen={menuOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        questions={questions}
        sets={sets}
        changeSet={changeSet}
        fetchQuestions={fetchQuestions} // Przekazanie funkcji do menu bocznego
      />

      <ThemeToggle toggleTheme={toggleTheme} />
    </div>
  );
};

export default App;