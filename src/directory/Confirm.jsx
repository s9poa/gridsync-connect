import { useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import { getUserWithProfile } from '../utils/auth';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import styles from '../css/confirm.module.css';

function Confirm({ setUser }) {
  useEffect(() => {
    const confirmAndSetUser = async () => {
      // Remove URL hash (e.g., #access_token)
      window.history.replaceState(null, '', window.location.pathname);

      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user) return;

      // Ensure profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profileData) {
        const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const guestUsername = `guest${suffix}`;
        await supabase.from('profiles').insert({
          id: user.id,
          username: guestUsername,
          title: 'newbie'
        });
      }

      // Set the user globally in your app
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
        <p>You’re all set! You can now start exploring GridSync and access your account features.</p>
        <Link to="/">Go to Home</Link>
      </div>
    </main>
  );
}

export default Confirm;
