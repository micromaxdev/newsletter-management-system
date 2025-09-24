import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, RefreshCw, CheckCircle, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmailList from '../sections/EmailList';
import SummaryModal from '../modals/SummaryModal';
import approvalService from '../services/approvalService';
import emailService from '../services/emailService';

const ApprovalQueue = () => {
  const [allSummarizedEmails, setAllSummarizedEmails] = useState([]); // Store all emails
  const [filteredEmails, setFilteredEmails] = useState([]); // Store filtered emails for display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmailForSummary, setSelectedEmailForSummary] = useState(null);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('all'); // 'all', 'approved', 'pending'

  const approvalFolderConfig = [
    { id: "approval", name: "Approval Queue", icon: Clock },
    { id: "approved", name: "Approved", icon: CheckCircle },
    { id: "pending", name: "Pending", icon: Clock }
  ];

  // Single fetch function to get all emails from server
  const fetchSummarizedEmails = async () => {
    try {
      setLoading(true);
      
      // Always fetch all emails from server (no query parameters)
      const data = await approvalService.getSummarizedEmails();
        
      // Transform the summarized email data to match EmailList expected format
      const transformedEmails = await Promise.all(data.map(async (email) => {
        let originalEmail = null;
        // Try to fetch the original email if originalEmailId exists
        try {
          if (email.originalEmailId && email.originalEmailId.length === 24) { // Valid MongoDB ObjectId length
            originalEmail = await emailService.fetchEmailById(email.originalEmailId);
            console.log(`Fetched original email for summary ${email._id}:`, originalEmail);
          } else if (email.originalEmailId) {
            console.warn(`Invalid ObjectId format for originalEmailId: ${email.originalEmailId}`);
          }
        } catch (emailError) {
          console.warn(`Could not fetch original email for ${email._id}:`, emailError.message);
          // Continue without the original email data
        }
        
        return {
          // Use the existing fields from summarized email
          _id: email._id,
          subject: email.title || "(No Subject)", // Use title as subject
          title: email.title || "(No Subject)",
          summary: email.summary,
          isApproved: email.isApproved,
          createdAt: email.createdAt,
          updatedAt: email.updatedAt,
          originalEmailId: email.originalEmailId,
          
          // EmailList required fields - use original email data if available
          from: originalEmail?.email?.from,
          date: email.createdAt,
          isRead: email.isApproved,
          folderId: originalEmail?.email?.folderId,
          tags: [
            "summary",
            email.isApproved ? "approved" : "pending-approval",
            ...(originalEmail?.email?.tags || [])
          ],
          hasSummary: true,
          
          seo: email.seo,
          
          // Store original email data for the modal
          originalEmail: originalEmail
        };
      }));
      console.log("Transformed summarized emails:", transformedEmails);
      setAllSummarizedEmails(transformedEmails); // Store all emails
      // Initial filtering will be handled by useEffect
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering function
  const applyFilters = () => {
    let filtered = [...allSummarizedEmails];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(email => 
        (email.title && email.title.toLowerCase().includes(query)) ||
        (email.summary && email.summary.toLowerCase().includes(query)) ||
        (email.subject && email.subject.toLowerCase().includes(query)) || 
        (email.from && (email.from.name && email.from.name.toLowerCase().includes(query) || 
                        email.from.address && email.from.address.toLowerCase().includes(query)))
      );
    }

    // Apply approval status filter
    if (approvalFilter !== 'all') {
      filtered = filtered.filter(email => 
        approvalFilter === 'approved' ? email.isApproved : !email.isApproved
      );
    }

    setFilteredEmails(filtered);
  };

  // Initial data fetch
  useEffect(() => {
    fetchSummarizedEmails();
  }, []);

  // Apply filters whenever search query, approval filter, or data changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, approvalFilter, allSummarizedEmails]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEmailClick = (email) => {
    // When clicking on an email in the approval queue, open the summary modal
    const summaryData = {
      data: {
        id: email._id,
        summary: email.summary,
        title: email.title,
        email: email,
        seo: email.seo,
        createdAt: email.createdAt,
        status: email.isApproved ? 'approved' : 'pending'
      },
      options: {
        allowApproval: true,
        allowEdit: true
      }
    };
    setSelectedEmailForSummary(summaryData);
  };

  const handleCloseSummaryModal = () => {
    setSelectedEmailForSummary(null);
  };

  const handleRefresh = () => {
    // Refetch all data from server
    fetchSummarizedEmails();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setApprovalFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setApprovalFilter('all');
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      padding: "2rem"
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/" style={{
              display: "flex",
              alignItems: "center",
              color: "#64748b",
              textDecoration: "none",
              fontSize: "14px"
            }}>
              <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
              Back to Home
            </Link>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: loading ? "#f1f5f9" : "#4f46e5",
              color: loading ? "#64748b" : "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <RefreshCw size={16} style={{ 
              animation: loading ? "spin 1s linear infinite" : "none" 
            }} />
            Refresh
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Clock size={24} style={{ color: "#f59e0b" }} />
            <div>
              <h1 style={{ 
                fontSize: "1.75rem", 
                fontWeight: "600", 
                margin: 0, 
                color: "#1e293b" 
              }}>
                Approval Queue
              </h1>
              <p style={{ 
                color: "#64748b", 
                margin: "0.25rem 0 0 0", 
                fontSize: "14px" 
              }}>
                Review and approve summarized emails ({filteredEmails.filter(email => !email.isApproved).length} pending)
              </p>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            {/* Search Input */}
            <div style={{ minWidth: "250px", display: "flex", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <Search 
                  size={16} 
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7280"
                  }}
                />
                <input
                  type="text"
                  placeholder="Search summaries..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.5rem 0.5rem 2rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                    backgroundColor: "#ffffff",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                />
              </div>
            </div>

            {/* Approval Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Filter size={16} style={{ color: "#6b7280" }} />
              <select
                value={approvalFilter}
                onChange={handleFilterChange}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "13px",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  cursor: "pointer",
                  minWidth: "120px"
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Only</option>
                <option value="approved">Approved Only</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || approvalFilter !== 'all') && (
              <button
                onClick={handleClearFilters}
                style={{
                  padding: "0.5rem 0.75rem",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#e5e7eb"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#f3f4f6"}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </motion.div>
      {/* Email List Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          minHeight: "400px"
        }}
      >
        <EmailList
          emails={filteredEmails}
          loading={loading}
          error={error}
          selectedFolder="approval"
          searchQuery=""
          selectedEmailForModal={null}
          onEmailClick={handleEmailClick}
          folderConfig={approvalFolderConfig}
          pagination={null} // No pagination for approval queue
          onLoadMore={null}
        />
      </motion.div>

      {/* Summary Modal */}
      {selectedEmailForSummary && (
        <SummaryModal
          summaryData={selectedEmailForSummary}
          type={"summary"}
          onClose={handleCloseSummaryModal}
        />
      )}
    </div>
  );
};

export default ApprovalQueue;
