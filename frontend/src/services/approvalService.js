import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5007';

const getSummarizedEmails = async () => {
  const response = await axios.get(`${API_URL}/api/summarized-emails`);
  return response.data;
};

const querySummarizedEmails = async (queryParams = {}) => {
  const params = new URLSearchParams();
  
  if (queryParams.searchQuery) {
    params.append('q', queryParams.searchQuery);
  }
  if (queryParams.isApproved !== undefined) {
    params.append('isApproved', queryParams.isApproved);
  }
  
  const queryString = params.toString();
  const url = queryString ? 
    `${API_URL}/api/summarized-emails/query?${queryString}` : 
    `${API_URL}/api/summarized-emails`;
    
  const response = await axios.get(url);
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
  querySummarizedEmails,
  approvalEmailSummary,
  rejectEmailSummary,
};


export default approvalService;
