import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState, useEffect } from 'react';
import { db, auth, projectStorage } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error('Could not complete signup');
      }

      // upload user thumbnail
      // console.log(thumbnail.name);
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      // create ref for img
      const imgRef = await ref(projectStorage, uploadPath);
      // upload img
      const imgFile = await uploadBytes(imgRef, thumbnail);
      // get url of img
      const imgUrl = await getDownloadURL(ref(projectStorage, imgRef));

      // add display name to user
      await updateProfile(res.user, { displayName, photoURL: imgUrl });

      // Create a user document
      await setDoc(doc(db, 'users', res.user.uid), {
        online: true,
        displayName,
        photoURL: imgUrl,
      });

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user });

      // update the state if success
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
};
