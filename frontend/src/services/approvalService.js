import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5007';

const getSummarizedEmails = async () => {
  const response = await axios.get(`${API_URL}/api/summarized-emails`);
  return response.data;
};

const approvalEmailSummary = async (summaryId, status) => {
  const response = await axios.put(
    `${API_URL}/api/summarized-emails/approval/${summaryId}`,
    {
      status: status
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

const rejectEmailSummary = async (summaryId) => {
  const response = await axios.delete(`${API_URL}/api/summarized-emails/${summaryId}`);
  return response.data;
} 
const approvalService = {
  getSummarizedEmails,
  approvalEmailSummary,
  rejectEmailSummary,
};


export default approvalService;
