import React from 'react';
  import AddQuestion from './AddQuestion';
  import DeleteQuestion from './DeleteQuestion';
  import ChangeSet from './ChangeSet';
  import AddSet from './AddSet';
  import DeleteSet from './DeleteSet';
  import './SideMenu.css';

  const SideMenu = ({ menuOpen, formData, handleInputChange, questions, sets, fetchQuestions }) => (
    <div className="side-menu" style={{ left: menuOpen ? '0' : '-290px' }}>
      <AddQuestion
        formData={formData}
        handleInputChange={handleInputChange}
        fetchQuestions={fetchQuestions} />
      <DeleteQuestion
        formData={formData}
        handleInputChange={handleInputChange}
        questions={questions}
        fetchQuestions={fetchQuestions} />
      <ChangeSet formData={formData} handleInputChange={handleInputChange} sets={sets} />
      <AddSet formData={formData} handleInputChange={handleInputChange} />
      <DeleteSet formData={formData} handleInputChange={handleInputChange} sets={sets} />
    </div>
  );

  export default SideMenu;