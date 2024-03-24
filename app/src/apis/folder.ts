import axios from "axios";

export const createFolder = async (
  folderName: string,
  project: string,
  parentFolder: string
) => {
  try {
    const response = await axios.post("http://localhost:3000/folders/", {
      folderName,
      project,
      parentFolder,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const deleteFolder = async (folderId: string) => {
  try {
    await axios.delete(`http://localhost:3000/folders/${folderId}`);
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};
