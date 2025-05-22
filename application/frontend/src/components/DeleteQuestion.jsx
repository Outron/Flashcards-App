import React from 'react';
import api from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DeleteQuestion.css';

const DeleteQuestion = ({ formData, handleInputChange, questions, fetchQuestions }) => {
    const handleDelete = async () => {
        if (!formData.questionId) {
            toast.error('Choose a question to delete.');
            return;
        }
        try {
            const questionToDelete = questions[formData.questionId];
            const deleteData = new URLSearchParams();
            deleteData.append('question_id', questionToDelete._id);

            const response = await api.delete('/api/delete_question', { data: deleteData });

            if (response.status === 200) {
                toast.success('Question deleted successfully.');
                await fetchQuestions();
                handleInputChange({ target: { name: 'questionId', value: '' } });
            }
        } catch (error) {
            console.error('Error', error);
            toast.error('An error occurred while deleting the question.');
        }
    };

    return (
        <div className="delete-question">
            <ToastContainer position="top-center" autoClose={3000} />
            <h2 className="question-text">Delete Q&A</h2>
            <form>
                <select
                    className="input-field"
                    name="questionId"
                    value={formData.questionId}
                    onChange={handleInputChange}
                >
                    <option value="" disabled style={{ color: '#a9a9a9' }}>
                        Choose question
                    </option>
                    {questions.map((q, index) => (
                        <option key={index} value={index} style={{ color: '#000' }}>
                            {q.question}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    id="delete-button"
                    className="material-icons"
                    onClick={handleDelete}
                >
                    delete
                </button>
            </form>
        </div>
    );
};

export default DeleteQuestion;