import React, {useState, useEffect} from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        setName: '',
        questionId: '',
        setToChange: '',
        setToDelete: ''
    });

    const [slideDirection, setSlideDirection] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('dark-theme', darkTheme);
    }, [darkTheme]);

    const fetchQuestions = async () => {
        try {
            const response = await api.get('/api/questions');
            setQuestions(response.data.questions);
            setCurrentIndex(0);
            setFlipped(false);
        } catch (error) {
            console.error('Błąd podczas pobierania pytań:', error);
        }
    };

    const fetchSets = async () => {
        try {
            const response = await api.get('/api/sets');
            const sets = response.data.sets;
            setSets(sets);

            if (!currentSet && sets.length > 0) {
                await changeSet(sets[0]);
            }
        } catch (error) {
            console.error('Błąd podczas pobierania zestawów:', error);
        }
    };

    const changeSet = async (setName) => {
        try {
            // Tworzymy FormData zamiast JSON
            const formData = new FormData();
            formData.append('set_name', setName);

            const response = await api.post('/api/change_set', formData);

            if (response.data && response.data.current_set) {
                setCurrentSet(response.data.current_set);
            } else {
                setCurrentSet(setName);
            }

            await fetchQuestions();
            console.log('Zmieniono zestaw na:', setName);
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

    const handleCardTransition = (direction) => {
        if (isAnimating || questions.length === 0) return;
        setIsAnimating(true);
        setSlideDirection(direction);
        setTimeout(() => {
            setCurrentIndex(prev =>
                direction === 'slide-left'
                    ? (prev + 1) % questions.length
                    : (prev - 1 + questions.length) % questions.length
            );
            setFlipped(false);
            setSlideDirection('');
            setTimeout(() => {
                setIsAnimating(false);
            }, 300);
        }, 300);
    };

    const prevCard = () => handleCardTransition('slide-right');
    const nextCard = () => handleCardTransition('slide-left');

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (
        <div className="flashcard-container">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="current-set-container">
                <p className="current-set">
                    {currentSet ? `Current set: ${currentSet}` : 'Current set: None'}
                </p>
            </div>

            <div className="flashcard-navigation">
                <button id="button_prev" className="material-icons nav-button" onClick={prevCard}
                        disabled={isAnimating}>
                    chevron_left
                </button>
                <div className={`flashcard-animator ${slideDirection} ${isAnimating ? 'animating' : ''}`}>
                    <Flashcard
                        question={questions[currentIndex]?.question}
                        answer={questions[currentIndex]?.answer}
                        flipped={flipped}
                        toggleCard={toggleCard}
                    />
                </div>
                <button id="button_next" className="material-icons nav-button" onClick={nextCard}
                        disabled={isAnimating}>
                    chevron_right
                </button>
            </div>

            <button id="menu-button" className="material-icons" onClick={toggleMenu}>
                menu
            </button>
            <SideMenu
                menuOpen={menuOpen}
                formData={formData}
                handleInputChange={handleInputChange}
                questions={questions}
                sets={sets}
                changeSet={changeSet}
                fetchQuestions={fetchQuestions}
                fetchSets={fetchSets}
                currentSet={currentSet}
            />

            <ThemeToggle toggleTheme={toggleTheme}/>
        </div>
    );
};

export default App;