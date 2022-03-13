import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Select component for form
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

// Styles
import './Create.css';

import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
import { timestamp } from '../../firebase/config';
import { useAuthContext } from '../../hooks/useAuthContext';

// Animate select options in form
const animatedComponents = makeAnimated();

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
];

export default function Create() {
  const { documents } = useCollection('users');
  const { addDocument, response } = useFirestore('projects');
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);

  // form field values
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    // map through users in firestore db
    // check if any
    if (documents) {
      // map through each user and return object w/ value and label
      setUsers(
        documents.map((user) => {
          return { value: { ...user, id: user.id }, label: user.displayName };
        })
      );
    }
  }, [documents]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      setFormError('Please add a category');
      return;
    }

    if (assignedUsers < 1) {
      setFormError('Please add 1 or more assigned users');
      return;
    }

    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        id: u.value.id,
        photoURL: u.value.photoURL,
      };
    });

    const createdBy = {
      displayName: user.displayName,
      id: user.uid,
      photoURL: user.photoURL,
    };

    // Project object to hold details before uploading to firestore
    const project = {
      name,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      assignedUsersList,
      createdBy,
      comments: [],
    };

    // Add project to firestore
    await addDocument(project);
    if (!response.error) {
      navigate('/');
    }
  };
  return (
    <div className="create-form">
      <h2 className="page-title">Create a new Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input
            required
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Project Details:</span>
          <textarea
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          ></textarea>
        </label>
        <label>
          <span>Set due date:</span>
          <input
            required
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project category:</span>
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>
        <label>
          <span>Assign to:</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            components={animatedComponents}
            isMulti
          />
        </label>

        <button className="btn">Add Project</button>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
}
