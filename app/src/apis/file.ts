import axios from "axios";

export const createFile = async (filename: string, parentFolderId: string) => {
  try {
    const response = await axios.post("http://localhost:3000/files/", {
      filename,
      content: "-",
      parentFolder: parentFolderId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    console.log("We called the Delete API");
    await axios.delete(`http://localhost:3000/files/${fileId}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
