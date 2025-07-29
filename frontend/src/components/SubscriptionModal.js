import React, { useState, useEffect } from 'react';
import { Bell, X, Trash2, Settings, Mail, Folder, Users } from 'lucide-react';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSubscription, setNewSubscription] = useState({
    type: 'sender',
    value: '',
    frequency: 'immediate'
  });

  const folderConfig = [
    { id: "inbox", name: "Inbox" },
    { id: "supplier", name: "Suppliers" },
    { id: "competitor", name: "Competitors" },
    { id: "information", name: "Information" },
    { id: "customers", name: "Customers" },
    { id: "marketing", name: "Marketing" },
    { id: "archive", name: "Archive" },
  ];

  // Fetch subscriptions when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSubscriptions();
    }
  }, [isOpen]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscriptions', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      } else {
        setError('Failed to fetch subscriptions');
      }
    } catch (err) {
      setError('Network error while fetching subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const addSubscription = async () => {
    if (!newSubscription.value.trim()) {
      setError('Please enter a value for the subscription');
      return;
    }

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newSubscription)
      });
      
      if (response.ok) {
        setNewSubscription({ type: 'sender', value: '', frequency: 'immediate' });
        setError('');
        fetchSubscriptions(); // Refresh the list
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add subscription');
      }
    } catch (err) {
      setError('Network error while adding subscription');
    }
  };

  const removeSubscription = async (subscriptionId) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchSubscriptions(); // Refresh the list
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to remove subscription');
      }
    } catch (err) {
      setError('Network error while removing subscription');
    }
  };

  const updateSubscriptionFrequency = async (subscriptionId, newFrequency) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ frequency: newFrequency })
      });
      
      if (response.ok) {
        fetchSubscriptions(); // Refresh the list
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update subscription');
      }
    } catch (err) {
      setError('Network error while updating subscription');
    }
  };

  const getDisplayName = (subscription) => {
    if (subscription.type === 'folder') {
      const folder = folderConfig.find(f => f.id === subscription.value);
      return folder ? folder.name : subscription.value;
    }
    return subscription.value;
  };

  const getIcon = (subscription) => {
    if (subscription.type === 'folder') {
      return <Folder size={16} className="text-amber-600" />;
    }
    return <Mail size={16} className="text-blue-600" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Bell className="text-indigo-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Manage Subscriptions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Add New Subscription */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Subscription</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newSubscription.type}
                    onChange={(e) => setNewSubscription({ ...newSubscription, type: e.target.value, value: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="sender">Email Sender</option>
                    <option value="folder">Folder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newSubscription.type === 'sender' ? 'Email Address' : 'Folder'}
                  </label>
                  {newSubscription.type === 'sender' ? (
                    <input
                      type="email"
                      value={newSubscription.value}
                      onChange={(e) => setNewSubscription({ ...newSubscription, value: e.target.value })}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  ) : (
                    <select
                      value={newSubscription.value}
                      onChange={(e) => setNewSubscription({ ...newSubscription, value: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select folder</option>
                      {folderConfig.map(folder => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newSubscription.frequency}
                    onChange={(e) => setNewSubscription({ ...newSubscription, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={addSubscription}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Bell size={16} className="mr-2" />
                Add Subscription
              </button>
            </div>
          </div>

          {/* Current Subscriptions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Subscriptions</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading subscriptions...</p>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 mt-2">No subscriptions yet</p>
                <p className="text-gray-400 text-sm">Add your first subscription above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((subscription) => (
                  <div
                    key={subscription._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getIcon(subscription)}
                      <div>
                        <p className="font-medium text-gray-900">
                          {getDisplayName(subscription)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {subscription.type === 'sender' ? 'Email sender' : 'Folder'} •{' '}
                          {subscription.frequency} notifications
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={subscription.frequency}
                        onChange={(e) => updateSubscriptionFrequency(subscription._id, e.target.value)}
                        className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                      
                      <button
                        onClick={() => removeSubscription(subscription._id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Remove subscription"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
