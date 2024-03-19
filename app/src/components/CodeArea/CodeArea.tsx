import { useState, useEffect } from "react";
import ContentEditable from "./ContentEditable";
import useEditorContext from "../../hooks/useEditorContext";
import "./CodeArea.css";

const CodeArea = () => {
  const { lines, handleLineChange, handleLineEnter } = useEditorContext();

  // State to keep track of the start and end indices of the selection
  const [selection, setSelection] = useState<{
    start: number | null;
    end: number | null;
  }>({ start: null, end: null });
  // State to keep track of mouse down event
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const handleMouseDown = (index: number) => {
    setSelection({ start: index, end: null });
    setIsMouseDown(true);
  };

  const handleMouseMove = (index: number) => {
    if (isMouseDown && selection.start !== null && selection.start !== index)
      setSelection({ start: selection.start, end: index });
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      if (selection.start !== null && selection.end !== null) {
        e.preventDefault(); // Prevent the default copy action

        // The start and end index of the selection
        const start = Math.min(selection.start, selection.end);
        const end = Math.max(selection.start, selection.end) + 1;

        // Copy the lines between start and end indices
        if (e.clipboardData) {
          e.clipboardData.setData(
            "text/plain",
            lines.slice(start, end).join("\n")
          );
        }
      }
    };

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, [selection, lines]);

  return (
    <div className="code-area">
      {lines.map((line, index) => {
        // Highlight the selected lines
        const htmlLine =
          selection.start !== null &&
          selection.end !== null &&
          index >= Math.min(selection.start, selection.end) &&
          index <= Math.max(selection.start, selection.end)
            ? `<span class="highlight">${line}</span>`
            : line;

        return (
          <div
            key={index}
            className="line-container"
            onMouseDown={() => handleMouseDown(index)}
            onMouseMove={() => handleMouseMove(index)}
            onMouseUp={handleMouseUp}
          >
            <div className="line-number">{index + 1}</div>
            <ContentEditable
              html={htmlLine}
              className="line-content"
              onChange={(e) => handleLineChange(e, index)}
              onKeyDown={(e) => handleLineEnter(e, index)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CodeArea;
