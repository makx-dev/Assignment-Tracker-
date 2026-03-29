const BASE_URL = 'http://localhost:3000/api';

export const getAllStudents = async () => {
  const res = await fetch(`${BASE_URL}/students`);
  return res.json();
};

export const getAllAssignments = async () => {
  const res = await fetch(`${BASE_URL}/assignments`);
  return res.json();
};

export const createAssignment = async (data) => {
  const res = await fetch(`${BASE_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.error || payload.message || 'Failed to create assignment');
  }
  return payload;
};

export const deleteAssignment = async (id) => {
  const res = await fetch(`${BASE_URL}/assignments/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

export const getSubmissionsByAssignment = async (assignmentId) => {
  const res = await fetch(`${BASE_URL}/submissions/assignment/${assignmentId}`);
  return res.json();
};

export const updateSubmissionStatus = async (submissionId, status) => {
  const res = await fetch(`${BASE_URL}/submissions/${submissionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
};
