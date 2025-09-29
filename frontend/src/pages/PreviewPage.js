import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SummarizationService from '../services/summarizationService';

const PreviewPage = () => {
  const { summaryId } = useParams();
  const [cleanedHTML, setCleanedHTML] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummarizedEmail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SummarizationService.getSummarizedEmailById(summaryId);
      setCleanedHTML(data.cleanedHTML || '');
      console.log('Fetched cleaned HTML:', data.cleanedHTML);
    } catch (err) {
      console.error('Error fetching summarized email:', err);
      setError(err.message);
      setCleanedHTML('');
    } finally {
      setLoading(false);
    }
  }, [summaryId]);

  useEffect(() => {
    if (summaryId) {
      fetchSummarizedEmail();
    } else {
      setError('No summary ID provided');
      setLoading(false);
    }
  }, [summaryId, fetchSummarizedEmail]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading preview...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#dc2626',
        textAlign: 'center'
      }}>
        <h3>Failed to load preview</h3>
        <p>{error}</p>
        <button 
          onClick={fetchSummarizedEmail}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!cleanedHTML) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666',
        textAlign: 'center'
      }}>
        <h3>No preview available</h3>
        <p>This email doesn't have processed HTML content.</p>
      </div>
    );
  }

  // Render the complete HTML document directly
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: cleanedHTML }}
      style={{ 
        width: '100%', 
        height: '100vh',
        margin: 0,
        padding: 0
      }}
    />
  );
};

export default PreviewPage;
