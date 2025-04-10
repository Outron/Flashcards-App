import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DeleteSet.css';
import api from '../api';

const DeleteSet = ({ formData, handleInputChange, sets, fetchSets }) => {
  const [loading, setLoading] = useState(false);

    const handleDeleteSet = async () => {
      if (!formData.setToDelete) {
        toast.error('Choose a set to delete.');
        return;
      }

      setLoading(true);
      try {
        const response = await api.delete('/delete_set', {
          data: new URLSearchParams({ set_name: formData.setToDelete }),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (response.status === 200) {
          toast.success(`Set "${formData.setToDelete}" deleted successfully.`);
          fetchSets(); // 
          handleInputChange({ target: { name: 'setToDelete', value: '' } });
      } catch (error) {
        console.error('Error deleting set:', error);
        toast.error('An error occurred while deleting the set.');
      } finally {
        setLoading(false);
      }
    };

  return (
	<div className="delete-set">
	  <h2 className="set-text">Delete set</h2>
	  <form>
		<select
		  className="input-field"
		  name="setToDelete"
		  value={formData.setToDelete}
		  onChange={handleInputChange}
		>
		  <option value="" disabled style={{ color: '#a9a9a9' }}>
			Choose set
		  </option>
		  {sets.map((s, index) => (
			<option key={index} value={s} style={{ color: '#000' }}>
			  {s}
			</option>
		  ))}
		</select>
		<button
		  type="button"
		  id="delete-set-button"
		  className="material-icons"
		  onClick={handleDeleteSet}
		  disabled={loading}
		>
		  delete
		</button>
	  </form>
	</div>
  );
};

export default DeleteSet;