import './Project.css';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import ProjectSummary from './ProjectSummary';
import ProjectComments from './ProjectComments';

export default function Project() {
  let { id } = useParams();
  const { document, error } = useDocument('projects', id);

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!document) {
    return <div>Loading...</div>;
  }
  return (
    <div className="project-details">
    <ProjectSummary project={document} />
    <ProjectComments project={document} />
  </div>
  );
}
