import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, AlertCircle } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const AutoSummarizationConfigModal = ({ onClose }) => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);
  const [formData, setFormData] = useState({
    folder: '',
    tag: ''
  });

  const folderOptions = [
    { value: 'inbox', label: 'Inbox' },
    { value: 'supplier', label: 'Suppliers' },
    { value: 'competitor', label: 'Competitors' },
    { value: 'information', label: 'Information' },
    { value: 'customers', label: 'Customers' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'archive', label: 'Archive' }
  ];

  // Fetch all configs
  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/configs');
      if (!response.ok) throw new Error('Failed to fetch configurations');
      const data = await response.json();
      setConfigs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new config
  const createConfig = async (configData) => {
    try {
      const response = await fetch('/api/configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });
      if (!response.ok) throw new Error('Failed to create configuration');
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Update config
  const updateConfig = async (id, configData) => {
    try {
      const response = await fetch(`/api/configs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });
      if (!response.ok) throw new Error('Failed to update configuration');
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Delete config
  const deleteConfig = async (id) => {
    try {
      const response = await fetch(`/api/configs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete configuration');
    } catch (err) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingConfig) {
        await updateConfig(editingConfig._id, formData);
      } else {
        await createConfig(formData);
      }
      await fetchConfigs();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setFormData({
      folder: config.folder,
      tag: config.tag
    });
    setShowForm(true);
  };

  const handleDelete = (config) => {
    setConfigToDelete(config);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setError(null);
      await deleteConfig(configToDelete._id);
      await fetchConfigs();
      setShowDeleteConfirmation(false);
      setConfigToDelete(null);
    } catch (err) {
      setError(err.message);
      setShowDeleteConfirmation(false);
      setConfigToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setConfigToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      folder: '',
      tag: ''
    });
    setEditingConfig(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            margin: 0,
            color: '#1e293b',
          }}>
            Auto Summarization Configuration
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '8px',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
            }}>
              <AlertCircle size={16} style={{ marginRight: '8px' }} />
              {error}
            </div>
          )}

          {/* Add New Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <Plus size={16} style={{ marginRight: '6px' }} />
              Add New Configuration
            </button>
          )}

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} style={{
              backgroundColor: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>
                {editingConfig ? 'Edit Configuration' : 'Add New Configuration'}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Folder:
                  </label>
                  <select
                    name="folder"
                    value={formData.folder}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                    }}
                  >
                    <option value="">Select Folder</option>
                    {folderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Tag:
                  </label>
                  <input
                    type="text"
                    name="tag"
                    value={formData.tag}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., TECHNOLOGY"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Save size={16} style={{ marginRight: '6px' }} />
                  {editingConfig ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Configurations List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading configurations...
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Existing Configurations Processed every 8 a.m.</h3>
              {configs.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                  No configurations found. Add your first configuration above.
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {configs.map((config) => (
                    <div
                      key={config._id}
                      style={{
                        backgroundColor: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <strong>Folder:</strong> {config.folder}
                            </div>
                            <div>
                              <strong>Tag:</strong> {config.tag}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                          <button
                            onClick={() => handleEdit(config)}
                            style={{
                              backgroundColor: '#f59e0b',
                              color: 'white',
                              padding: '6px',
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(config)}
                            style={{
                              backgroundColor: '#dc2626',
                              color: 'white',
                              padding: '6px',
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && configToDelete && (
        <ConfirmationModal
          title="Delete Configuration"
          message={`Are you sure you want to delete the configuration for "${configToDelete.folder}" folder with "${configToDelete.tag}" tag?`}
          highlightText="This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmColor="#dc2626"
          handleConfirmation={handleConfirmDelete}
          handleCancellation={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default AutoSummarizationConfigModal;