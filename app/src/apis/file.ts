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
