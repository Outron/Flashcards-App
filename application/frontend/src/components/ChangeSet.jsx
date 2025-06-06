import React, {useState} from 'react';
import {toast} from 'react-toastify';
import './ChangeSet.css';

const ChangeSet = ({formData, handleInputChange, sets, changeSet, currentSet}) => {
    const [loading, setLoading] = useState(false);

    const handleChangeSet = async () => {
        if (!formData.setToChange) {
            toast.error('Choose a set to change.');
            return;
        }

        setLoading(true);
        try {
            await changeSet(formData.setToChange);
            toast.success(`Set changed to "${formData.setToChange}".`);
            handleInputChange({target: {name: 'setToChange', value: ''}});
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
                    <option value="" disabled style={{color: '#a9a9a9'}}>
                        Choose set
                    </option>
                    {sets.map((set, index) => (
                        <option key={index} value={set} style={{color: '#000'}}>
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