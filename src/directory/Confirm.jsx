import { useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import { getUserWithProfile } from '../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import styles from '../css/confirm.module.css';

function Confirm({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmAndSetUser = async () => {
      // Remove URL hash (e.g., #access_token)
      window.history.replaceState(null, '', window.location.pathname);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create or update profile row using UPSERT to avoid duplicates
      await supabase.from('profiles').upsert({
        id: user.id,
        username: `guest${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        title: 'newbie',
        profile_picture: '/placeholder.png'
      });

      // Fetch complete profile
      const fullProfile = await getUserWithProfile();
      if (fullProfile) setUser(fullProfile);
    };

    confirmAndSetUser();
  }, []);

  return (
    <main>
      <Header title="Thank you!" />
      <div className={styles.container}>
        <h2>Your email has been verified successfully.</h2>
        <p>You're all set! You can now start exploring GridSync and access your account features.</p>
        <Link to="/">Go to Home</Link>
      </div>
    </main>
  );
}

export default Confirm;
