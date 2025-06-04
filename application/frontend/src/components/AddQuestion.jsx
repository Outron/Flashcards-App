import React, {useState} from 'react';
import api from '../api';
import {toast} from 'react-toastify'; // usunięto ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import './AddQuestion.css';

const AddQuestion = ({fetchQuestions}) => {
    const [formData, setFormData] = useState({question: '', answer: ''});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleAdd = async () => {
        if (!formData.question || !formData.answer) {
            toast.error('Both question and answer are required.');
            return;
        }
        setLoading(true);
        try {
            const response = await api.post('/api/add_question', {
                question: formData.question,
                answer: formData.answer,
            });

            if (response.status === 200) {
                toast.success('Question added successfully.');
                setFormData({question: '', answer: ''});
                await fetchQuestions();
            }
        } catch (error) {
            console.error('Error', error);
            toast.error('An error occurred while adding the question.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-question">
            <h2 className="question-text">Add Q&A</h2>
            <form>
                <input
                    type="text"
                    className="input-field"
                    name="question"
                    placeholder="Enter question"
                    value={formData.question}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    className="input-field"
                    name="answer"
                    placeholder="Enter answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                />
                <button
                    type="button"
                    id="add-button"
                    className="material-icons"
                    onClick={handleAdd}
                    disabled={loading}
                >
                    add
                </button>
            </form>
        </div>
    );
};

export default AddQuestion;