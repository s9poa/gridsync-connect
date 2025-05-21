import supabase from './supabaseClient';

export async function signUp(email, password) {
    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if (authError) {
        console.error("Auth error:", authError.message);
        return { error: authError.message };
    }

    const userId = authData.user.id;

    // Step 2: Generate guestXXXX username
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const guestUsername = `guest${suffix}`;

    // Step 3: Insert into 'profiles' table
    const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        username: guestUsername,
        title: 'newbie'
    });

    if (profileError) {
        console.error("Profile insert error:", profileError.message);
        return { error: profileError.message };
    }

    return { success: true };
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Sign-in error:", error.message);
        return { error: error.message };
    }

    return { success: true };
}

export async function getUserWithProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase.from('profiles').select('username, title').eq('id', session.user.id).single();
    if (error) {
        console.error("Profile fetch error:", error.message);
        return null;
    }

    return {
        id: session.user.id,
        email: session.user.email,
        username: data.username,
        title: data.title
    };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Sign-out error:", error.message);
}
