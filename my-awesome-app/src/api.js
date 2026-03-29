const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const handleResponse = async (res) => {
  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.error || payload.message || 'API request failed');
  }
  return payload;
};

export const getAllStudents = async () => {
  const res = await fetch(`${BASE_URL}/students`);
  return handleResponse(res);
};

export const getAllAssignments = async () => {
  const res = await fetch(`${BASE_URL}/assignments`);
  return handleResponse(res);
};

export const createAssignment = async (data) => {
  const res = await fetch(`${BASE_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteAssignment = async (id) => {
  const res = await fetch(`${BASE_URL}/assignments/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
};

export const getSubmissionsByAssignment = async (assignmentId) => {
  const res = await fetch(`${BASE_URL}/submissions/assignment/${assignmentId}`);
  return handleResponse(res);
};

export const updateSubmissionStatus = async (submissionId, status) => {
  const res = await fetch(`${BASE_URL}/submissions/${submissionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
};
