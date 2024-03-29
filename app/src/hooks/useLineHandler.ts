import { useState, useEffect } from "react";
import useWebSocket from "./useWebSocket";

type UseLineHandlers = [
  string[],
  React.Dispatch<React.SetStateAction<string[]>>,
  (e: React.FormEvent<HTMLDivElement>, index: number) => void,
  (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void,
  (e: React.ClipboardEvent<HTMLDivElement>, index: number) => void,
  (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void,
  (start: number, end: number) => void,
  (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void,
  (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void,
  (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void
];

export default function useLineHandlers(
  initialLines: string[]
): UseLineHandlers {
  const [lines, setLines] = useState(initialLines);
  const [caretIndex, setCaretIndex] = useState<number | null>(null);
  const { send } = useWebSocket("ws://localhost:8080", (data) => {
    if (data.type === "lines") {
      setLines(data.lines);
    }
  });

  const handleLineChange = (
    e: React.FormEvent<HTMLDivElement>,
    index: number
  ) => {
    setLines((prevLines) => {
      const newLines = [...prevLines];
      newLines[index] = e.currentTarget.innerHTML;

      send({ type: "lines", lines: newLines });

      return newLines;
    });
  };

  const handleLineEnter = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const sel = window.getSelection();
      if (sel) {
        const selRange = sel.getRangeAt(0);
        // Get the text after the caret position
        const textAfterCaret =
          selRange.endContainer.textContent?.slice(selRange.endOffset) || "";

        setLines((prevLines) => {
          const newLines = [...prevLines];
          // Update current line to include text until the caret position
          newLines[index] = newLines[index].slice(0, selRange.endOffset);
          // Insert a new line after the current line with the text
          newLines.splice(index + 1, 0, textAfterCaret);
          return newLines;
        });

        setCaretIndex(index + 1);
      }
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();

    const newLines = [...lines];
    const htmlText = e.clipboardData.getData("text/html");

    if (htmlText.includes("<div>")) {
      // Split the content by divs and remove the div tags
      const splitContent = htmlText
        .split("<div>")
        .map((line) => line.replace("</div>", ""));

      // Remove the first div
      splitContent.shift();

      // Update the current line with the first line
      newLines[index] += splitContent.shift();

      newLines.splice(index + 1, 0, ...splitContent);
    } else {
      const plainText = e.clipboardData.getData("text/plain");

      // Split the plain text by newlines
      const splitContent = plainText.split("\n");

      // Update the current line with the first line
      newLines[index] += splitContent.shift();

      newLines.splice(index + 1, 0, ...splitContent);
    }

    setLines(newLines);
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    setLines((prevLines) => {
      const sel = window.getSelection();
      if (sel && sel.focusOffset === 0 && index > 0) {
        e.preventDefault();
        const newLines = [...prevLines];
        // Remove the current line
        newLines.splice(index, 1);
        // Set the index of the previous line
        setCaretIndex(index - 1);
        return newLines;
      }
      return prevLines;
    });
  };

  const handleBackspaceHighlight = (start: number, end: number) => {
    setLines((prevLines) => {
      const newLines = [...prevLines];
      // Remove the highlighted lines
      newLines.splice(start, end - start);
      // Set the index of the previous line
      setCaretIndex(start - 1);
      return newLines;
    });
  };

  const handleArrowUp = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    setCaretIndex(index - 1);
  };

  const handleArrowDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    setCaretIndex(index + 1);
  };

  const handleTab = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setLines((prevLines) => {
      const newLines = [...prevLines];
      newLines[index] += "&nbsp;&nbsp;";
      return newLines;
    });
  };

  useEffect(() => {
    if (caretIndex !== null) {
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel) {
          // Select the previous div
          const prevLine =
            document.querySelectorAll(".line-content")[caretIndex];
          if (prevLine) {
            const range = document.createRange();
            // Set the caret position to the end of the previous line
            range.setStart(prevLine, prevLine.childNodes.length || 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
        // Reset the backspace index
        setCaretIndex(null);
      }, 0);
    }
  }, [caretIndex]);

  return [
    lines,
    setLines,
    handleLineChange,
    handleLineEnter,
    handlePaste,
    handleBackspace,
    handleBackspaceHighlight,
    handleArrowUp,
    handleArrowDown,
    handleTab,
  ];
}
