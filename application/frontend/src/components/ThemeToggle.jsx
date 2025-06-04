import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({toggleTheme}) => (
    <button id="theme-toggle" className="material-icons" onClick={toggleTheme}>brightness_4</button>
);

export default ThemeToggle;