import React, { useState } from 'react';
import { timestamp } from '../../firebase/config';
import { useAuthContext } from '../../hooks/useAuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useFirestore } from '../../hooks/useFirestore';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../../components/Avatar';

export default function ProjectComments({ project }) {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthContext();
  const { updateDocument, response } = useFirestore('projects');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const comment = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: timestamp.fromDate(new Date()),
      id: uuidv4(),
    };

    await updateDocument(project.id, {
      comments: [...project.comments, comment],
    });

    if (!response.error) {
      setNewComment('');
    }
  };

  return (
    <div className="project-comments">
      <h4>Project Comments</h4>

      <ul>
        {project.comments.length > 0 &&
          project.comments.map((comment) => (
            <li key={comment.id}>
              <div className="comment-author">
                <Avatar src={comment.photoURL} />
                <p>{comment.displayName}</p>
              </div>
              <div className="comment-date">
                <p>
                  {formatDistanceToNow(comment.createdAt.toDate(), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
            </li>
          ))}
      </ul>
      <form className="add-comment" onSubmit={handleSubmit}>
        <label>
          <span>Add new comment:</span>
          <textarea
            required
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
            value={newComment}
          ></textarea>
        </label>
        <button>Add comment</button>
      </form>
    </div>
  );
}
