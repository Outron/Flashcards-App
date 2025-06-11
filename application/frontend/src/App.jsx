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
    const [slideDirection, setSlideDirection] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        setName: '',
        questionId: '',
        setToChange: '',
        setToDelete: ''
    });

    useEffect(() => {
        document.body.classList.toggle('dark-theme', darkTheme);
    }, [darkTheme]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        await fetchSets();
        await fetchQuestions();
    };

    const fetchQuestions = async () => {
        try {
            const response = await api.get('/api/questions');
            setQuestions(response.data.questions);
            setCurrentIndex(0);
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
            const form = new FormData();
            form.append('set_name', setName);
            const response = await api.post('/api/change_set', form);
            setCurrentSet(response.data?.current_set || setName);
            await fetchQuestions();
        } catch (error) {
            console.error('Błąd podczas zmiany zestawu:', error);
        }
    };

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
            setSlideDirection('');
            setIsAnimating(false);
        }, 150);
    };

    const handleInputChange = (e) => {
        const target = e.target || e;
        setFormData(prev => ({
            ...prev,
            [target.name]: target.value
        }));
    };

    return (
        <div className={`flashcard-container ${menuOpen ? 'menu-open' : ''}`}>
            <ToastContainer position="top-center" autoClose={3000}/>
            <div className="current-set-container">
                <p className="current-set">
                    {currentSet ? `Current set: ${currentSet}` : 'No set selected'}
                </p>
            </div>
            <div className="flashcard-navigation">
                <button id="button_prev" className="material-icons nav-button"
                        onClick={() => handleCardTransition('slide-right')} disabled={isAnimating}>
                    chevron_left
                </button>
                <div className={`flashcard-animator ${slideDirection} ${isAnimating ? 'animating' : ''}`}>
                    <Flashcard
                        question={questions[currentIndex]?.question}
                        answer={questions[currentIndex]?.answer}
                        slideDirection={slideDirection}
                    />
                </div>
                <button id="button_next" className="material-icons nav-button"
                        onClick={() => handleCardTransition('slide-left')} disabled={isAnimating}>
                    chevron_right
                </button>
            </div>
            <button className="material-icons menu-toggle-button" onClick={() => setMenuOpen(!menuOpen)}>
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
                toggleMenu={() => setMenuOpen(!menuOpen)}
            />
            <ThemeToggle toggleTheme={() => setDarkTheme(!darkTheme)}/>
        </div>
    );
};

export default App;