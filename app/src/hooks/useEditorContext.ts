import { useContext } from "react";
import EditorContext from "../contexts/EditorContext";

export default function useEditorContext() {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("Must be used within an EditorContext Provider");
  }

  return context;
}
