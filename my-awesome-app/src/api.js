const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const isDemoMode = () => localStorage.getItem('demo') === '1';

// --- Demo storage helpers ---
const DEMO_KEY = 'demo_assignments';
const getDemoAssignments = () => {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};
const saveDemoAssignments = (arr) => {
  localStorage.setItem(DEMO_KEY, JSON.stringify(arr));
};

export const login = async (email, password) => {
  if (isDemoMode()) {
    return { token: null, teacher: { email, name: 'Demo Teacher', role: 'teacher' } };
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Login failed: ${res.status}`);
  }

  return res.json();
};

export const getAllStudents = async () => {
  if (isDemoMode()) {
    return [
      { id: 'demo-1', name: 'Aaditi Tiwari', rollNo: '1', email: 'aaditi.tiwari.it@ghrcemn.raisoni.net', div: 'I1' }
    ];
  }

  const res = await fetch(`${BASE_URL}/students`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);
  return res.json();
};

export const getAllAssignments = async () => {
  if (isDemoMode()) return getDemoAssignments();

  try {
    const res = await fetch(`${BASE_URL}/assignments`, { headers: { ...authHeaders() } });
    if (!res.ok) throw new Error(`Failed to fetch assignments: ${res.status}`);
    return res.json();
  } catch (err) {
    return getDemoAssignments();
  }
};

export const createAssignment = async (data) => {
  if (isDemoMode()) {
    const arr = getDemoAssignments();
    const newItem = { id: `demo-${Date.now()}`, title: data.title, subject: data.subject, dueDate: data.dueDate || data.deadline || null, maxMarks: data.maxMarks || 20, desc: data.desc || data.description || '' };
    arr.unshift(newItem);
    saveDemoAssignments(arr);
    return newItem;
  }

  try {
    const res = await fetch(`${BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Failed to create assignment: ${res.status}`);
    const result = await res.json();
    return result.assignment || result;
  } catch (err) {
    // fallback to demo
    const arr = getDemoAssignments();
    const newItem = { id: `demo-${Date.now()}`, title: data.title, subject: data.subject, dueDate: data.dueDate || data.deadline || null, maxMarks: data.maxMarks || 20, desc: data.desc || data.description || '' };
    arr.unshift(newItem);
    saveDemoAssignments(arr);
    return newItem;
  }
};

export const deleteAssignment = async (id) => {
  if (isDemoMode()) {
    const arr = getDemoAssignments();
    const filtered = arr.filter(a => (a.id || a._id) !== id);
    saveDemoAssignments(filtered);
    return { message: 'deleted' };
  }

  try {
    const res = await fetch(`${BASE_URL}/assignments/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
    if (!res.ok) throw new Error(`Failed to delete assignment: ${res.status}`);
    return res.json();
  } catch (err) {
    const arr = getDemoAssignments();
    const filtered = arr.filter(a => (a.id || a._id) !== id);
    saveDemoAssignments(filtered);
    return { message: 'deleted' };
  }
};

export const getSubmissionsByAssignment = async (assignmentId) => {
  if (isDemoMode()) return [];
  const res = await fetch(`${BASE_URL}/submissions/assignment/${assignmentId}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch submissions: ${res.status}`);
  return res.json();
};

export const updateSubmissionStatus = async (submissionId, status) => {
  if (isDemoMode()) return { message: 'updated' };
  const res = await fetch(`${BASE_URL}/submissions/${submissionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(`Failed to update submission: ${res.status}`);
  return res.json();
};

