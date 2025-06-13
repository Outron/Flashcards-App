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
                      formData,
                      handleInputChange,
                      questions,
                      sets,
                      changeSet,
                      fetchQuestions,
                      fetchSets,
                      toggleMenu,
                      currentSet
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
                handleInputChange({target: {name: 'questionId', value: ''}}); // <-- DODAJ TO
            }
        } catch (error) {
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
            const response = await api.delete(
                `/api/delete_question?question_id=${encodeURIComponent(formData.questionId)}`
            );
            if (response.status === 200) {
                toast.success('Question deleted successfully.');
                await fetchQuestions();
                handleInputChange({target: {name: 'questionId', value: ''}});
            }
        } catch (error) {
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
                handleInputChange({target: {name: 'setToDelete', value: ''}});
                const updatedSets = await fetchSets();
                if (formData.setToDelete === currentSet) {
                    if (updatedSets && updatedSets.length > 0) {
                        await changeSet(updatedSets[0]);
                    } else {
                        await changeSet('');
                    }
                }
            }
        } catch (error) {
            toast.error('An error occurred while deleting the set.');
        } finally {
            setLoadingDeleteSet(false);
        }
    };

    const menuSections = [
        {
            title: "ADD QUESTION",
            fields: [
                {type: "text", name: "question", placeholder: "Insert question"},
                {type: "text", name: "answer", placeholder: "Insert answer"}
            ],
            button: {onClick: handleAddQuestion, icon: "add", className: "add-button", loading: loadingAdd}
        },
        {
            title: "DELETE QUESTION",
            fields: [
                {
                    type: "select",
                    name: "questionId",
                    placeholder: "Choose question",
                    options: questions.map(q => ({ value: q._id, label: q.question }))
                }
            ],
            button: {onClick: handleDeleteQuestion, icon: "delete", className: "delete-button", loading: loadingDelete}
        },
        {
            title: "CHANGE SET",
            fields: [
                {
                    type: "select",
                    name: "setToChange",
                    placeholder: "Choose set",
                    options: sets
                }
            ],
            button: {onClick: handleChangeSet, icon: "sync", className: "change-button", loading: loadingChangeSet}
        },
        {
            title: "ADD SET",
            fields: [
                {type: "text", name: "setName", placeholder: "Set name"}
            ],
            button: {onClick: handleAddSet, icon: "add", className: "add-button", loading: loadingAddSet}
        },
        {
            title: "DELETE SET",
            fields: [
                {
                    type: "select",
                    name: "setToDelete",
                    placeholder: "Choose set",
                    options: sets
                }
            ],
            button: {onClick: handleDeleteSet, icon: "delete", className: "delete-button", loading: loadingDeleteSet}
        }
    ];

    return (
        <>
            <div className="menu-overlay" onClick={toggleMenu}></div>
            <div className="side-menu">
                <ActionButton
                    onClick={toggleMenu}
                    icon="close"
                    className="close-menu"
                />
                <div className="menu-content">
                    {menuSections.map((section, idx) => (
                        <MenuSection key={idx} title={section.title}>
                            {section.fields.map((field, i) =>
                                field.type === "text" ? (
                                    <TextInput
                                        key={i}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleInputChange}
                                        placeholder={field.placeholder}
                                    />
                                ) : (
                                    <SelectField
                                        key={i}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleInputChange}
                                        options={field.options}
                                        placeholder={field.placeholder}
                                    />
                                )
                            )}
                            <ActionButton
                                onClick={section.button.onClick}
                                icon={section.button.icon}
                                disabled={section.button.loading}
                                className={section.button.className}
                            />
                        </MenuSection>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SideMenu;