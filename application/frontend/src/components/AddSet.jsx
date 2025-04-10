import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddSet.css';
import api from '../api';

const AddSet = ({ formData, handleInputChange, fetchSets }) => {
  const [loading, setLoading] = useState(false);

  const handleAddSet = async () => {
    if (!formData.setName) {
      toast.error('Set name is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        '/add_set',
        new URLSearchParams({ set_name: formData.setName }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      if (response.status === 200) {
        toast.success(`Set "${formData.setName}" added successfully.`);
        fetchSets();
        handleInputChange({ target: { name: 'setName', value: '' } });
      }
    } catch (error) {
      console.error('Error adding set:', error);
      toast.error('An error occurred while adding the set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-set">
      <h2 className="set-text">Add set</h2>
      <form>
        <input
          className="input-field"
          type="text"
          name="setName"
          placeholder="Set name"
          value={formData.setName}
          onChange={handleInputChange}
        />
        <button
          type="button"
          id="add-set-button"
          className="material-icons"
          onClick={handleAddSet}
          disabled={loading}
        >
          add
        </button>
      </form>
    </div>
  );
};

export default AddSet;