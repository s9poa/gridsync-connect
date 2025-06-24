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

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Sign-out error:", error.message);
}

export async function updateUser(updateObj) {
    const { error } = await supabase
        .from('profiles')
        .update(updateObj)
        .eq('id', (await supabase.auth.getUser()).data.user.id);

    if (error) {
        console.error("Username update error:", error.message);
        return { error };
    }

    return { success: true };
}

export async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
        console.error("Password update error:", error.message);
        return { error: error.message };
    }
    return { success: true };
}

export async function getUserWithProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('username, title, profile_picture')
        .eq('id', session.user.id)
        .single();

    if (error) {
        console.error("Profile fetch error:", error.message);
        return null;
    }

    return {
        id: session.user.id,
        email: session.user.email,
        username: data.username,
        title: data.title,
        profile_picture: data.profile_picture || null
    };
}

export async function updateProfilePicture(imagePath) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error("Auth error:", userError?.message);
        return { error: userError?.message || "No user found" };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ profile_picture: imagePath })
        .eq('id', user.id);

    if (error) {
        console.error("Profile picture update error:", error.message);
        return { error: error.message };
    }

    return { success: true };
}

export async function getAccountCreatedAt() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return { created_at: user.created_at };
}

export async function addFavorite({ game_id, title, image_path, price, type }) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error("User not found:", userError?.message);
        return { error: "Not signed in" };
    }

    const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        game_id,
        title,
        image_path,
        price,
        type
    });

    if (error) {
        console.error("Insert error:", error.message);
        return { error: error.message };
    }

    return { success: true };
}

export async function getFavorites() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('id, title, image_path')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching favorites:", error.message);
    return [];
  }

  return data;
}

export async function removeFavorite(favoriteId) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("User not found:", userError?.message);
    return { error: "Not signed in" };
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId)
    .eq('user_id', user.id);

  if (error) {
    console.error("Delete favorite error:", error);
    return { error: error.message };
  }

  return { success: true };
}

export async function searchUsers(username) {
  const trimmed = username.trim();

  const { data: sessionData } = await supabase.auth.getUser();
  const user = sessionData?.user;

  let query = supabase
    .from('profiles')
    .select('id, username, title, profile_picture')
    .ilike('username', `%${trimmed}%`);

  // If signed in, exclude self from search results
  if (user) query = query.neq('id', user.id);

  const { data, error } = await query;

  if (error) {
    console.error("Search error:", error.message);
    return [];
  }

  return data;
}


export async function addFriend(friendId) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("User not found:", userError?.message);
    return { error: "Not signed in" };
  }

  const { error } = await supabase.from('friends').insert({
    user_id: user.id,
    friend_id: friendId
  });

  if (error) {
    if (error.code === "23505") return { success: true }; // already added
    console.error("Add friend error:", error.message);
    return { error: error.message };
  }

  return { success: true };
}

export async function getFriends() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return [];

  const { data, error } = await supabase
    .from('friends')
    .select('friend_id')
    .eq('user_id', user.id);

  if (error) {
    console.error("Fetch friends error:", error.message);
    return [];
  }

  const friendIds = data.map(f => f.friend_id);

  if (!friendIds.length) return [];

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, title, profile_picture')
    .in('id', friendIds);

  if (profileError) {
    console.error("Fetch profile error:", profileError.message);
    return [];
  }

  return profiles;
}

export async function removeFriend(friendId) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { error: "Not signed in" };

  const { error } = await supabase
    .from('friends')
    .delete()
    .match({ user_id: user.id, friend_id: friendId });

  if (error) {
    console.error("Remove friend error:", error.message);
    return { error: error.message };
  }

  return { success: true };
}
