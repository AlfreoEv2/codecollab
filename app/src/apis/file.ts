import axios from "axios";

const createFile = async (filename: string, parentFolderId: string) => {
  try {
    const response = await axios.post("http://localhost:3000/files/", {
      filename,
      content: [],
      parentFolder: parentFolderId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

const deleteFile = async (fileId: string) => {
  try {
    console.log("We called the Delete API");
    await axios.delete(`http://localhost:3000/files/${fileId}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

const renameFile = async (fileId: string, newFilename: string) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/files/${fileId}`,
      {
        newFilename,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error renaming file:", error);
    throw error;
  }
};

const updateFileContent = async (fileId: string, newContent: string[]) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/files/${fileId}/content`,
      {
        newContent,
      }
    );

    console.log("Response from the server:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating file content:", error);
    throw error;
  }
};

export { createFile, deleteFile, renameFile, updateFileContent };
