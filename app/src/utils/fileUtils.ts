import { File, Folder } from "../interfaces/SidebarInterface";

const findFileById = (folders: Folder[], fileId: string): File | null => {
  for (const folder of folders) {
    const foundFile = folder.files.find((file: File) => file._id === fileId);
    if (foundFile) {
      return foundFile;
    }
    if (folder.children?.length) {
      const foundFile = findFileById(folder.children, fileId);
      if (foundFile) {
        return foundFile;
      }
    }
  }
  return null;
};

export { findFileById };
