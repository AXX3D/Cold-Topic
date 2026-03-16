// Authentication functionality for Cold Topic

// Default admin account
const DEFAULT_ADMIN = {
  email: 'admin@coldtopic.com',
  username: 'admin',
  password: 'admin123',
  name: 'Admin',
  role: 'admin'
};

// Initialize users in localStorage if not exists
function initializeUsers() {
  const users = getUsers();
  const adminExists = users.some(user => user.email === DEFAULT_ADMIN.email);

  if (!adminExists) {
    users.push(DEFAULT_ADMIN);
    saveUsers(users);
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Register a new user
function registerUser(name, username, email, password) {
  const users = getUsers();

  // Check if user already exists
  if (users.some(user => user.email === email || user.username === username)) {
    return { success: false, message: 'User with this email or username already exists' };
  }

  // Create new user
  const newUser = {
    name: name,
    username: username,
    email: email,
    password: password, // In a real app, this would be hashed
    role: 'user'
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: 'Account created successfully' };
}

// Login user
function loginUser(identifier, password) {
  const users = getUsers();

  const user = users.find(u => (u.email === identifier || u.username === identifier) && u.password === password);

  if (user) {
    // Store current user session
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user: user };
  } else {
    return { success: false, message: 'Invalid username/email or password' };
  }
}

// Get current logged in user
function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
}

// Logout user
function logoutUser() {
  setCurrentUser(null);
}

// Check if user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

function updateUserRole(email, role) {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }

  users[userIndex] = { ...users[userIndex], role };
  saveUsers(users);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email === email) {
    setCurrentUser(users[userIndex]);
  }

  return { success: true, user: users[userIndex] };
}

function deleteUser(email) {
  if (email === DEFAULT_ADMIN.email) {
    return { success: false, message: 'Default admin account cannot be deleted' };
  }

  const users = getUsers();
  const userToDelete = users.find(user => user.email === email);

  if (!userToDelete) {
    return { success: false, message: 'User not found' };
  }

  const nextUsers = users.filter(user => user.email !== email);
  saveUsers(nextUsers);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email === email) {
    setCurrentUser(null);
  }

  return { success: true, user: userToDelete };
}

// Update navbar based on auth state
function updateNavbar() {
  const currentUser = getCurrentUser();
  const navRight = document.querySelector('.navRight');

  // Don't show auth elements on auth pages
  if (window.location.pathname.includes('/auth/')) {
    return;
  }

  if (!navRight) return;

  // Remove existing auth elements
  const existingAuth = navRight.querySelector('.auth-elements');
  if (existingAuth) {
    existingAuth.remove();
  }

  const authDiv = document.createElement('div');
  authDiv.className = 'auth-elements';

  if (currentUser) {
    // User is logged in - determine correct paths based on current page
    let adminPath = 'pages/admin/index.html';

    if (window.location.pathname.includes('/pages/')) {
      adminPath = '../admin/index.html';
    }

    // Don't show admin link if we're already on the admin dashboard
    const showAdminLink = currentUser.role === 'admin' && !window.location.pathname.includes('/admin/');

    authDiv.innerHTML = `
      <span class="welcome-user">Welcome, ${currentUser.name}</span>
      ${showAdminLink ? `<a href="${adminPath}" class="admin-link">Admin Dashboard</a>` : ''}
      <button class="logout-btn" onclick="logoutUser(); window.location.reload();">Logout</button>
    `;
  } else {
    // User is not logged in - determine correct paths based on current page
    let loginPath = 'pages/auth/login.html';
    let signupPath = 'pages/auth/signup.html';

    if (window.location.pathname.includes('/pages/')) {
      loginPath = '../auth/login.html';
      signupPath = '../auth/signup.html';
    }

    authDiv.innerHTML = `
      <a href="${loginPath}" class="nav-link">Sign In</a>
      <button class="accountButton" onclick="window.location.href='${signupPath}'">Sign Up</button>
    `;
  }

  navRight.appendChild(authDiv);

  if (typeof applyNavbarIcons === 'function') {
    applyNavbarIcons(authDiv);
  }

  if (typeof applyContextualIcons === 'function') {
    applyContextualIcons(authDiv);
  }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeUsers();
  updateNavbar();
});
