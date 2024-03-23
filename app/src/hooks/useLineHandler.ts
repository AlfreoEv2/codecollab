import { useState, useEffect } from "react";

type UseLineHandlers = [
  string[],
  (e: React.FormEvent<HTMLDivElement>, index: number) => void,
  (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void,
  (e: React.ClipboardEvent<HTMLDivElement>, index: number) => void,
  (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void
];

export default function useLineHandlers(
  initialLines: string[]
): UseLineHandlers {
  const [lines, setLines] = useState(initialLines);
  const [backspaceIndex, setBackspaceIndex] = useState<number | null>(null);

  const handleLineChange = (
    e: React.FormEvent<HTMLDivElement>,
    index: number
  ) => {
    setLines((prevLines) => {
      const newLines = [...prevLines];
      newLines[index] = e.currentTarget.innerHTML;
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

        setTimeout(() => {
          // Select the next div
          const nextLine =
            document.querySelectorAll(".line-content")[index + 1];
          if (nextLine) {
            const range = document.createRange();
            range.setStart(nextLine, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }, 0);
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
      if (e.code === "Backspace" && prevLines[index] === "" && index > 0) {
        e.preventDefault();
        const newLines = [...prevLines];
        // Remove the current line
        newLines.splice(index, 1);
        // Set the index of the previous line
        setBackspaceIndex(index - 1);
        return newLines;
      }

      return prevLines;
    });
  };

  useEffect(() => {
    if (backspaceIndex !== null) {
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel) {
          // Select the previous div
          const prevLine =
            document.querySelectorAll(".line-content")[backspaceIndex];
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
        setBackspaceIndex(null);
      }, 0);
    }
  }, [backspaceIndex]);

  return [
    lines,
    handleLineChange,
    handleLineEnter,
    handlePaste,
    handleBackspace,
  ];
}
