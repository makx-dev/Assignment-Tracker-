
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Students
export const getAllStudents = async () => {
  const res = await fetch(`${BASE_URL}/students`);
  if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);
  return res.json();
};

// Assignments
export const getAllAssignments = async () => {
  const res = await fetch(`${BASE_URL}/assignments`);
  if (!res.ok) throw new Error(`Failed to fetch assignments: ${res.status}`);
  return res.json();
};

export const createAssignment = async (data) => {
  const res = await fetch(`${BASE_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create assignment: ${res.status}`);
  return res.json();
};

export const deleteAssignment = async (id) => {
  const res = await fetch(`${BASE_URL}/assignments/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete assignment: ${res.status}`);
  return res.json();
};

// Submissions (kept as-is, but added error handling)
export const getSubmissionsByAssignment = async (assignmentId) => {
  const res = await fetch(`${BASE_URL}/submissions/assignment/${assignmentId}`);
  if (!res.ok) throw new Error(`Failed to fetch submissions: ${res.status}`);
  return res.json();
};

export const updateSubmissionStatus = async (submissionId, status) => {
  const res = await fetch(`${BASE_URL}/submissions/${submissionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(`Failed to update submission: ${res.status}`);
  return res.json();
};

