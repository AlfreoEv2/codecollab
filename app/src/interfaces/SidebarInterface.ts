export interface File {
  _id: string;
  filename: string;
  content: string[];
}

export interface Folder {
  _id: string;
  folderName: string;
  files: File[];
  children: Folder[];
}

export type FileOrFolder = File | Folder;
