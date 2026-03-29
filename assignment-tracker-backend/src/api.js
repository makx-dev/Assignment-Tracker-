const BASE_URL = 'http://localhost:3000/api';

// Students
export const getAllStudents = async () => {
    const res = await fetch(`${BASE_URL}/students`);
    return res.json();
};

//Assignments
export const createAssignment = async (data) => {
    const res = await fetch(`${BASE_URL}/assignments`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
    });
    return res.json();
};

//Submissions
export const updateSubmissionStatus = async (submissionId, status) => {
    const res = await fetch(`${BASE_URL}/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status})
    });
    return res.json();
};

