import { useState, useEffect } from "react";
import ContentEditable from "./ContentEditable";
import useEditorContext from "../../hooks/useEditorContext";
import "./CodeArea.css";

const CodeArea = () => {
  const {
    lines,
    handleLineChange,
    handleLineEnter,
    handlePaste,
    handleBackspace,
    handleBackspaceHighlight,
    handleArrowUp,
    handleArrowDown,
    handleTab,
  } = useEditorContext();

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

    const handleCut = (e: ClipboardEvent) => {
      if (selection.start !== null && selection.end !== null) {
        e.preventDefault();

        const start = Math.min(selection.start, selection.end);
        const end = Math.max(selection.start, selection.end) + 1;

        if (e.clipboardData) {
          e.clipboardData.setData(
            "text/plain",
            lines.slice(start, end).join("\n")
          );
        }

        // Remove the lines between start and end indices from the editor
        handleBackspaceHighlight(start, end);

        setSelection({ start: null, end: null });
      }
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
    };
  }, [selection, lines]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const lineContainers = document.querySelectorAll(".line-container");
      // Check if the click is outside the line containers
      const isClickOutside = Array.from(lineContainers).every(
        (container) => !container.contains(e.target as Node)
      );

      if (isClickOutside) {
        // Reset the selection
        setSelection({ start: null, end: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              onKeyDown={(e) => {
                switch (e.key) {
                  case "Enter":
                    handleLineEnter(e, index);
                    break;
                  case "Backspace":
                    if (selection.start !== null && selection.end !== null) {
                      e.preventDefault();
                      const start = Math.min(selection.start, selection.end);
                      const end = Math.max(selection.start, selection.end) + 1;
                      handleBackspaceHighlight(start, end);
                      setSelection({ start: null, end: null });
                    } else {
                      handleBackspace(e, index);
                    }
                    break;
                  case "ArrowUp":
                    handleArrowUp(e, index);
                    break;
                  case "ArrowDown":
                    handleArrowDown(e, index);
                    break;
                  case "Tab":
                    handleTab(e, index);
                    break;
                  default:
                    break;
                }
              }}
              onPaste={(e) => handlePaste(e, index)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CodeArea;
