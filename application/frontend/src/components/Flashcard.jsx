import React, {useState, useEffect} from 'react';
import './Flashcard.css';

const Flashcard = ({question, answer, slideDirection}) => {
    const [flipped, setFlipped] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        setFlipped(false);
        setIsFlipping(false);
    }, [question]);

    const handleClick = () => {
        setIsFlipping(true);
        setFlipped(f => !f);
    };

    return (
        <div
            id="flashcard"
            className={`flashcard ${slideDirection}`}
            onClick={handleClick}
            style={{cursor: 'pointer'}}
        >
            <div
                className="card-inner"
                style={{
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: isFlipping ? 'transform 0.6s' : 'none'
                }}
            >
                <div className="card-front">{question}</div>
                <div className="card-back">{answer}</div>
            </div>
        </div>
    );
};

export default Flashcard;