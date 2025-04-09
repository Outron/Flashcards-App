import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ChangeSet.css';
import api from '../api';

const ChangeSet = ({ formData, handleInputChange, sets, fetchQuestions, fetchSets }) => {
const [loading, setLoading] = useState(false);

const handleChangeSet = async () => {
  if (!formData.setToChange) {
    toast.error('Choose a set to change.');
    return;
  }

  setLoading(true);
  try {
    const response = await api.post(
      '/change_set',
      new URLSearchParams({ set_name: formData.setToChange }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.status === 200) {
      toast.success(`Set changed to "${formData.setToChange}".`);
      fetchQuestions(); // Odśwież pytania dla nowego zestawu
      fetchSets(); // Odśwież listę zestawów
      handleInputChange({ target: { name: 'setToChange', value: '' } }); // Resetuj pole
    }
  } catch (error) {
    console.error('Error changing set:', error);
    toast.error('An error occurred while changing the set.');
  } finally {
    setLoading(false);
  }
};

return (
  <div className="change-set">
    <h2 className="set-text">Change set</h2>
    <form>
      <select
        className="input-field"
        name="setToChange"
        value={formData.setToChange}
        onChange={handleInputChange}
      >
        <option value="" disabled style={{ color: '#a9a9a9' }}>
          Choose set
        </option>
        {sets.map((set, index) => (
          <option key={index} value={set} style={{ color: '#000' }}>
            {set}
          </option>
        ))}
      </select>
      <button
        type="button"
        id="change-set-button"
        className="material-icons"
        onClick={handleChangeSet}
        disabled={loading}
      >
        sync
      </button>
    </form>
  </div>
);
};

export default ChangeSet;