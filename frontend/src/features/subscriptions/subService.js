import axios from "axios";

const API_URL = "/api/subscriptions";

/**
 * Add a new subscription
 * @param {Object} subscriptionData - The subscription data
 * @param {string} subscriptionData.userId - The user's ID
 * @param {string} subscriptionData.type - Type of subscription ('sender' or 'folder')
 * @param {string} subscriptionData.value - Email address for sender type, folder ID for folder type
 * @param {string} subscriptionData.frequency - Frequency of updates ('immediate', 'daily', 'weekly')
 * @returns {Promise} - The created subscription object
 *
 * Example usage:
 * const newSubscription = await subService.addSubscription({
 *   userId: 'user123',
 *   type: 'sender',
 *   value: 'example@domain.com',
 *   frequency: 'daily'
 * });
 */
const addSubscription = async (subscriptionData) => {
  try {
    const response = await axios.post(API_URL, subscriptionData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get all subscriptions for a user
 * @param {string} userId - The user's ID
 * @returns {Promise} - Array of user's subscriptions
 *
 * Example response:
 * {
 *   userId: '123',
 *   subscriptions: [{
 *     type: 'sender',
 *     value: 'example@domain.com',
 *     frequency: 'daily',
 *     lastChecked: '2025-07-29T10:00:00Z',
 *     _id: '456'
 *   }]
 * }
 */
const getUserSubscriptions = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Update an existing subscription
 * @param {string} subscriptionId - ID of the subscription to update
 * @param {Object} updateData - The data to update (must include userId and any fields to update)
 * @param {string} updateData.userId - The user's ID
 * @param {string} [updateData.frequency] - New frequency ('immediate', 'daily', 'weekly')
 * @returns {Promise} - The updated subscription object
 *
 * Example usage:
 * const updatedSubscription = await subService.updateSubscription(
 *   'subscription123',
 *   { userId: 'user123', frequency: 'weekly' }
 * );
 */
const updateSubscription = async (subscriptionId, updateData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${subscriptionId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Remove a subscription
 * @param {string} subscriptionId - ID of the subscription to delete
 * @param {string} userId - The user's ID
 * @returns {Promise} - Success message
 *
 * Example usage:
 * const result = await subService.removeSubscription('subscription123', 'user123');
 * // result: { message: 'Subscription removed successfully' }
 */
const removeSubscription = async (subscriptionId, userId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${subscriptionId}?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get content from all subscribed sources for a user
 * @param {Object} params - Query parameters (must include userId)
 * @param {string} params.userId - The user's ID
 * @param {number} [params.page] - Page number for pagination (default: 1)
 * @param {number} [params.limit] - Number of items per page (default: 20)
 * @returns {Promise} - Paginated email content from subscribed sources
 *
 * Example response:
 * {
 *   emails: [{...email objects...}],
 *   total: 50,
 *   page: 1,
 *   pages: 3
 * }
 *
 * Example usage:
 * const content = await subService.getSubscribedContent({
 *   userId: 'user123',
 *   page: 1,
 *   limit: 20
 * });
 */
const getSubscribedContent = async (params) => {
  try {
    const { userId, ...rest } = params;
    const queryString = new URLSearchParams({ ...rest, userId }).toString();
    const response = await axios.get(`${API_URL}/content?${queryString}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Error handler for consistent error formatting
 * @private
 */
const handleError = (error) => {
  const message =
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString();

  // Enhance error object with status code if available
  const enhancedError = new Error(message);
  enhancedError.status = error.response ? error.response.status : 500;
  return enhancedError;
};

const subService = {
  addSubscription,
  getUserSubscriptions,
  updateSubscription,
  removeSubscription,
  getSubscribedContent,
};

export default subService;
