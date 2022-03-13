import React, { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';

import Projects from '../../components/Projects';

// Styles
import './Dashboard.css';
import ProjectFilter from './ProjectFilter';

export default function Dashboard() {
  const [filter, setCurrentFilter] = useState('all');
  const { documents, error } = useCollection('projects');
  const { user } = useAuthContext();

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  // Filter the projects based on the changeFilter function and pass the filtered projects down to the Projects components that will be viewed
  const projects = documents
    ? documents.filter((document) => {
        switch (filter) {
          case 'all':
            return true;
          case 'mine':
            let assignedToMe = false;
            document.assignedUsersList.forEach((u) => {
              if (u.id === user.uid) {
                assignedToMe = true;
              }
            });
            return assignedToMe;
          case 'development':
          case 'design':
          case 'sales':
          case 'marketing':
            console.log(document.category, filter);
            return document.category === filter;
          default:
            return true;
        }
      })
    : null;
  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {documents && (
        <ProjectFilter currentFilter={filter} changeFilter={changeFilter} />
      )}
      {projects && <Projects projects={projects} />}
    </div>
  );
}
