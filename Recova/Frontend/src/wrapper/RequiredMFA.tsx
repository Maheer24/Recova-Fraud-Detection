// // RequiredMFA.js
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import Loading from '../components/Loader';


const RequiredMFA = ({ children }) => {
  const [level, setLevel] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.mfa.getAuthenticatorAssuranceLevel().then(({ data }) => {
      if (data) {
        setLevel(data.currentLevel);
      }
    });
  }, []);

  if (level === null) return <Loading />; // Wait for check

  if (level !== 'aal2') {
    // If not aal2, send to setup-2fa (which will handle verification)
    return <Navigate to="/setup-2fa" replace />;
  }

  return children; // If aal2, show the protected page (Dashboard)
};

export default RequiredMFA;