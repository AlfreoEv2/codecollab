import axios from "axios";

interface CreateProjectData {
  projectName: string;
  owner: string;
  collaborators: string[];
  language: string;
}

export const createProject = async (projectData: CreateProjectData) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/projects/",
      projectData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};
