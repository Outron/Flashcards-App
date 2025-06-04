import React from 'react';
import './Flashcard.css';

const Flashcard = ({ question, answer, flipped, toggleCard, slideDirection }) => (
  <div id="flashcard" className={`flashcard ${slideDirection}`} onClick={toggleCard}>
    <div className="card-inner" style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
      <div className="card-front">{question}</div>
      <div className="card-back">{answer}</div>
    </div>
  </div>
);

export default Flashcard;