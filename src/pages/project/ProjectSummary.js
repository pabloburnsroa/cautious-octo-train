import React from 'react';
import Avatar from '../../components/Avatar';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProjectSummary({ project }) {
  const { deleteDocument, response } = useFirestore('projects');
  const { user } = useAuthContext();

  let navigate = useNavigate();

  // Handle the mark as complete action
  const handleClick = (e) => {
    deleteDocument(project.id);
    if (!response.error) {
      navigate('/');
    }
  };

  return (
    <div>
      <div className="project-summary">
        <h2 className="page-title">{project.name}</h2>
        <p>Project created by {project.createdBy.displayName}</p>
        <p className="due-date">
          Project due by {project.dueDate.toDate().toDateString()}
        </p>
        <p className="details">{project.details}</p>
        <h4>Project assigned to:</h4>
        <div className="assigned-users">
          {project.assignedUsersList.map((user) => (
            <div key={user.id}>
              <Avatar src={user.photoURL} />
            </div>
          ))}
        </div>
      </div>
      {user.uid === project.createdBy.id && (
        <button className="btn" onClick={handleClick}>
          Mark as Complete
        </button>
      )}
    </div>
  );
}
