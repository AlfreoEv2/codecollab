import axios from "axios";

export const getProjectsByOwner = async (ownerId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/projects/owner/${ownerId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.error("No projects found for the given owner");
      } else {
        console.error("Error retrieving projects by owner:", error);
      }
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};
