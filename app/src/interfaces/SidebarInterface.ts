interface FileOrFolder {
  name: string;
  type: "file" | "folder";
  children?: FileOrFolder[];
}

interface FileNavigatorProps {
  files: FileOrFolder[];
}

interface SidebarProps {
  files: FileOrFolder[];
}

export type { FileOrFolder, FileNavigatorProps, SidebarProps };
