import React, { useEffect, useState } from 'react';
import approvalService from '../services/approvalService';

const ApprovalQueue = () => {
  const [summarizedEmails, setSummarizedEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummarizedEmails = async () => {
      try {
        const data = await approvalService.getSummarizedEmails();
        setSummarizedEmails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummarizedEmails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Approval Queue</h1>
      {summarizedEmails.length === 0 ? (
        <p>No summarized emails to approve.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {summarizedEmails.map((email) => (
            <li key={email._id} style={{ border: '1px solid #ccc', borderRadius: '8px', marginBottom: '1rem', padding: '1rem' }}>
              <h3>{email.subject}</h3>
              <p><strong>From:</strong> {email.from}</p>
              <p><strong>Date:</strong> {new Date(email.date).toLocaleString()}</p>
              <h4>Summary:</h4>
              <p>{email.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApprovalQueue;
