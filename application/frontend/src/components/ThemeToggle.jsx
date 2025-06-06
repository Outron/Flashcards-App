import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({toggleTheme}) => (
    <button id="theme-toggle" onClick={toggleTheme}>
        <i className="material-icons">brightness_4</i>
    </button>
);

export default ThemeToggle;