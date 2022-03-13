// import hooks
import { useState, useEffect } from 'react';

// import firestore db
import { db } from '../firebase/config';
// firebase imports
import { doc, onSnapshot } from 'firebase/firestore';

export const useDocument = (c, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ref = doc(db, c, id);
    const unsub = onSnapshot(
      ref,
      (doc) => {
        if (doc.data()) {
          setDocument({ ...doc.data(), id: doc.id });
          setError(null);
        } else {
          setError('No document exists');
        }
      },
      (error) => {
        setError('Could not fetch the data');
        console.log(error.message);
      }
    );
    return () => unsub();
  }, [c, id]);

  return { document, error };
};
