import React from 'react';
import './ChangeSet.css';
const ChangeSet = ({ formData, handleInputChange, sets }) => (
  <div className="change-set">
    <h2 className="set-text">Change set</h2>
    <form>
      <select className="input-field" name="setToChange" value={formData.setToChange} onChange={handleInputChange}>
        {sets.map((s, index) => (
          <option key={index} value={s}>{s}</option>
        ))}
      </select>
      <button type="button" id="change-set-button" className="material-icons">change_circle</button>
    </form>
  </div>
);

export default ChangeSet;