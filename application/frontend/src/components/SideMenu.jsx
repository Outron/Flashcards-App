import React, {useState} from 'react';
import {toast} from 'react-toastify';
import api from '../api';
import './SideMenu.css';

const MenuSection = ({title, children}) => (
    <div className="menu-section">
        <h2 className="section-text">{title}</h2>
        <form>{children}</form>
    </div>
);

const SelectField = ({name, value, onChange, options, placeholder}) => (
    <select
        className="input-field"
        name={name}
        value={value}
        onChange={onChange}
    >
        <option value="" disabled style={{color: '#a9a9a9'}}>
            {placeholder}
        </option>
        {options.map((option, index) => (
            <option key={index} value={option.value || option} style={{color: '#000'}}>
                {option.label || option}
            </option>
        ))}
    </select>
);

const ActionButton = ({onClick, icon, disabled = false, className = ""}) => (
    <button
        type="button"
        className={`menu-section-button ${className}`}
        onClick={onClick}
        disabled={disabled}
    >
        <div className="button-content">
            <i className="material-icons">{icon}</i>
        </div>
    </button>
);


const TextInput = ({name, value, onChange, placeholder}) => (
    <input
        type="text"
        className="input-field"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
    />
);

const SideMenu = ({
                      menuOpen,
                      formData,
                      handleInputChange,
                      questions,
                      sets,
                      changeSet,
                      fetchQuestions,
                      fetchSets,
                      currentSet,
                      toggleMenu
                  }) => {
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingChangeSet, setLoadingChangeSet] = useState(false);
    const [loadingAddSet, setLoadingAddSet] = useState(false);
    const [loadingDeleteSet, setLoadingDeleteSet] = useState(false);

    const handleAddQuestion = async () => {
        if (!formData.question || !formData.answer) {
            toast.error('Both question and answer are required.');
            return;
        }
        setLoadingAdd(true);
        try {
            const response = await api.post('/api/add_question', {
                question: formData.question,
                answer: formData.answer,
            });

            if (response.status === 200) {
                toast.success('Question added successfully.');
                handleInputChange({target: {name: 'question', value: ''}});
                handleInputChange({target: {name: 'answer', value: ''}});
                await fetchQuestions();
            }
        } catch (error) {
            console.error('Error', error);
            toast.error('An error occurred while adding the question.');
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleDeleteQuestion = async () => {
        if (!formData.questionId) {
            toast.error('Choose a question to delete.');
            return;
        }
        setLoadingDelete(true);
        try {
            const questionToDelete = questions[formData.questionId];
            const deleteData = new URLSearchParams();
            deleteData.append('question_id', questionToDelete._id);

            const response = await api.delete('/api/delete_question', {data: deleteData});

            if (response.status === 200) {
                toast.success('Question deleted successfully.');
                await fetchQuestions();
                handleInputChange({target: {name: 'questionId', value: ''}});
            }
        } catch (error) {
            console.error('Error', error);
            toast.error('An error occurred while deleting the question.');
        } finally {
            setLoadingDelete(false);
        }
    };

    const handleChangeSet = async () => {
        if (!formData.setToChange) {
            toast.error('Choose a set to change.');
            return;
        }

        setLoadingChangeSet(true);
        try {
            await changeSet(formData.setToChange);
            toast.success(`Set changed to "${formData.setToChange}".`);
            handleInputChange({target: {name: 'setToChange', value: ''}});
        } catch (error) {
            console.error('Error changing set:', error);
            toast.error('An error occurred while changing the set.');
        } finally {
            setLoadingChangeSet(false);
        }
    };

    const handleAddSet = async () => {
        if (!formData.setName) {
            toast.error('Set name is required.');
            return;
        }

        setLoadingAddSet(true);
        try {
            const response = await api.post(
                '/api/add_set',
                new URLSearchParams({set_name: formData.setName}),
                {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
            );
            if (response.status === 200) {
                toast.success(`Set "${formData.setName}" added successfully.`);
                fetchSets();
                handleInputChange({target: {name: 'setName', value: ''}});
            }
        } catch (error) {
            console.error('Error adding set:', error);
            toast.error('An error occurred while adding the set.');
        } finally {
            setLoadingAddSet(false);
        }
    };

    const handleDeleteSet = async () => {
        if (!formData.setToDelete) {
            toast.error('Choose a set to delete.');
            return;
        }

        setLoadingDeleteSet(true);
        try {
            const response = await api.delete(
                '/api/delete_set',
                {
                    data: new URLSearchParams({set_name: formData.setToDelete}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            );

            if (response.status === 200) {
                toast.success(`Set "${formData.setToDelete}" deleted successfully.`);
                await fetchSets();
                handleInputChange({target: {name: 'setToDelete', value: ''}});
            }
        } catch (error) {
            console.error('Error deleting set:', error);
            toast.error('An error occurred while deleting the set.');
        } finally {
            setLoadingDeleteSet(false);
        }
    };

    return (
        <>
            {}
            <div className="menu-overlay" onClick={toggleMenu}></div>

            <div className="side-menu">
                <ActionButton
                    onClick={toggleMenu}
                    icon="close"
                    className="close-menu"
                />

                <div className="menu-content">
                    <MenuSection title="ADD QUESTION">
                        <TextInput
                            name="question"
                            value={formData.question}
                            onChange={handleInputChange}
                            placeholder="Insert question"
                        />
                        <TextInput
                            name="answer"
                            value={formData.answer}
                            onChange={handleInputChange}
                            placeholder="Insert answer"
                        />
                        <ActionButton
                            onClick={handleAddQuestion}
                            icon="add"
                            disabled={loadingAdd}
                            className="add-button"
                        />
                    </MenuSection>

                    <MenuSection title="DELETE QUESTION">
                        <SelectField
                            name="questionId"
                            value={formData.questionId}
                            onChange={handleInputChange}
                            options={questions.map((q, index) => ({value: index, label: q.question}))}
                            placeholder="Choose question"
                        />
                        <ActionButton
                            onClick={handleDeleteQuestion}
                            icon="delete"
                            disabled={loadingDelete}
                            className="delete-button"
                        />
                    </MenuSection>

                    <MenuSection title="CHANGE SET">
                        <SelectField
                            name="setToChange"
                            value={formData.setToChange}
                            onChange={handleInputChange}
                            options={sets}
                            placeholder="Choose set"
                        />
                        <ActionButton
                            onClick={handleChangeSet}
                            icon="sync"
                            disabled={loadingChangeSet}
                            className="change-button"
                        />
                    </MenuSection>

                    <MenuSection title="ADD SET">
                        <TextInput
                            name="setName"
                            value={formData.setName}
                            onChange={handleInputChange}
                            placeholder="Set name"
                        />
                        <ActionButton
                            onClick={handleAddSet}
                            icon="add"
                            disabled={loadingAddSet}
                            className="add-button"
                        />
                    </MenuSection>

                    <MenuSection title="DELETE SET">
                        <SelectField
                            name="setToDelete"
                            value={formData.setToDelete}
                            onChange={handleInputChange}
                            options={sets}
                            placeholder="Choose set"
                        />
                        <ActionButton
                            onClick={handleDeleteSet}
                            icon="delete"
                            text="Usuń"
                            disabled={loadingDeleteSet}
                            className="delete-button"
                        />
                    </MenuSection>
                </div>
            </div>
        </>
    );
};

export default SideMenu;