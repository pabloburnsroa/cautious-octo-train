import { useReducer, useEffect, useState } from 'react';
import { db, timestamp } from '../firebase/config';
import {
  deleteDoc,
  collection,
  addDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: false, error: null };
    case 'ADDED_DOCUMENT':
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case 'DELETED_DOCUMENT':
      return { isPending: false, document: null, success: true, error: null };
    case 'ERROR':
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    case 'UPDATED_DOCUMENT':
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    default:
      return state;
  }
};

export const useFirestore = (c) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // collection ref
  const ref = collection(db, c);

  // only dispatch is not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (docToUpload) => {
    // console.log(docToUpload);
    dispatch({ type: 'IS_PENDING' });

    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await addDoc(ref, {
        ...docToUpload,
        createdAt,
      });
      dispatchIfNotCancelled({
        type: 'ADDED_DOCUMENT',
        payload: addedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      await deleteDoc(doc(db, c, id));
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' });
    }
  };

  // update a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const updateRef = doc(db, c, id);
      const updatedDocument = await updateDoc(updateRef, updates);
      dispatchIfNotCancelled({
        type: 'UPDATED_DOCUMENT',
        payload: updatedDocument,
      });
      return updatedDocument;
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
      return null;
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
