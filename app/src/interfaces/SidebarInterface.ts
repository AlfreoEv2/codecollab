interface FileOrFolder {
  name: string;
  type: "file" | "folder";
  children?: FileOrFolder[];
}

export type { FileOrFolder };
