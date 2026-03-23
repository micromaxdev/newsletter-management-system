import axios from "axios";

const API_URL = "/api/folders";

const getAuthConfig = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return {
    headers: {
      "Content-Type": "application/json",
      ...(userInfo?.token && {
        Authorization: `Bearer ${userInfo.token}`,
      }),
    },
  };
};

const folderService = {
  async getAllFolders() {
    const response = await axios.get(API_URL, getAuthConfig());
    return response.data;
  },

  async createFolder(folderData) {
    const response = await axios.post(API_URL, folderData, getAuthConfig());
    return response.data;
  },

  async createSubfolder(parentFolderId, folderData) {
    const response = await axios.post(
      `${API_URL}/${parentFolderId}/subfolders`,
      folderData,
      getAuthConfig()
    );
    return response.data;
  },

  async updateFolder(folderId, folderData) {
    const response = await axios.put(
      `${API_URL}/${folderId}`,
      folderData,
      getAuthConfig()
    );
    return response.data;
  },

  async deleteFolder(folderId) {
    const response = await axios.delete(
      `${API_URL}/${folderId}`,
      getAuthConfig()
    );
    return response.data;
  },

  async getSubfolders(parentFolderId) {
    const response = await axios.get(
      `${API_URL}/${parentFolderId}/subfolders`,
      getAuthConfig()
    );
    return response.data;
  },

  async searchFolders(query) {
    const response = await axios.get(
      `${API_URL}/search?q=${encodeURIComponent(query)}`,
      getAuthConfig()
    );
    return response.data;
  },

  async getFolderStats() {
    const response = await axios.get(`${API_URL}/stats`, getAuthConfig());
    return response.data;
  },
};

export default folderService;