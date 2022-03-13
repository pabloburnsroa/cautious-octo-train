import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

export const useCollection = (c, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  useEffect(() => {
    // Fetch the data from firestore as soon as component mounts
    // Use let as we might update reference later
    let ref = collection(db, c);
    // Check if there is a query attached to useCollection if so attach where query to ref
    if (query) {
      ref = ref.where(...query);
    }
    // Check if orderBy parameter attached to the useCollection function call
    if (orderBy) {
      ref = ref.orderBy(...orderBy);
    }

    // Subscription returns an unsubscribe function, will fire function every time collection changes
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError('could not fetch the data');
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [c, query, orderBy]);

  return { documents, error };
};
