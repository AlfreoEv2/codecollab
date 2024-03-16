import { useState } from "react";

type UseLineHandlers = [
  string[],
  (e: React.FormEvent<HTMLDivElement>, index: number) => void,
  (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void
];

export default function useLineHandlers(
  initialLines: string[]
): UseLineHandlers {
  const [lines, setLines] = useState(initialLines);

  const handleLineChange = (
    e: React.FormEvent<HTMLDivElement>,
    index: number
  ) => {
    const newLines = [...lines];
    newLines[index] = e.currentTarget.innerHTML;
    setLines(newLines);
  };

  const handleLineOnEnter = (
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

  return [lines, handleLineChange, handleLineOnEnter];
}
