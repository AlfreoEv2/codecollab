import axios from "axios";
import { File, Folder } from "../interfaces/SidebarInterface";

interface CreateProjectData {
  projectName: string;
  owner: string;
  collaborators: string[];
  language: string;
}

export const createProject = async (projectData: CreateProjectData) => {
  try {
    const response = await axios.post(
      "https://codecollab-m571.onrender.com/projects/",
      projectData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjectDetails = async (projectId: string) => {
  try {
    const response = await axios.get(
      `https://codecollab-m571.onrender.com/projects/${projectId}`
    );
    const project = response.data;
    console.log("Project:", JSON.stringify(project, null, 2));

    const transformFolder = (folder: Folder): Folder => ({
      _id: folder._id,
      folderName: folder.folderName,
      files: folder.files.map((file: File) => ({
        _id: file._id,
        filename: file.filename,
        content: file.content,
      })),
      children: folder.children.map(transformFolder),
    });

    const rootFolder = transformFolder(project.rootFolder);
    console.log("Root folder:", JSON.stringify(rootFolder, null, 2));

    return {
      ...project,
      rootFolder,
    };
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};
