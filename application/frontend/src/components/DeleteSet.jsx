import React from 'react';
import './DeleteSet.css';
const DeleteSet = ({ formData, handleInputChange, sets }) => (
  <div className="delete-set">
    <h2 className="set-text">Delete set</h2>
    <form>
      <select className="input-field" name="setToDelete" value={formData.setToDelete} onChange={handleInputChange}>
        {sets.map((s, index) => (
          <option key={index} value={s}>{s}</option>
        ))}
      </select>
      <button type="button" id="delete-set-button" className="material-icons">delete</button>
    </form>
  </div>
);

export default DeleteSet;