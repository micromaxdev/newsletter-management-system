import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5007';

const getSummarizedEmails = async () => {
  const response = await axios.get(`${API_URL}/api/summarized-emails`);
  return response.data;
};

const approvalService = {
  getSummarizedEmails,
};

export default approvalService;
