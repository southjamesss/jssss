import { useState } from 'react';

const Notes = ({ setIsNotesOpen }) => {
  const [isMinimized, setIsMinimized] = useState(false); // Track if the note is minimized
  const [noteContent, setNoteContent] = useState(''); // Track the content of the note

  // Handle textarea changes
  const handleTextareaChange = (e) => {
    setNoteContent(e.target.value);
  };

  return (
    <div
      className={`fixed bottom-16 right-6 ${isMinimized ? '' : 'bg-white dark:bg-gray-800'
        } border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${isMinimized ? 'w-16 h-16' : 'w-[380px] h-[450px]'
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3  from-purple-600 to-indigo-600 rounded-t-lg text-white">
        <h2
          className={`text-xl font-semibold transition-all duration-300 ${isMinimized ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            } text-black`} // Added text-black to set the text color to black
        >
          📝 Notes
        </h2>
        {/* Close Button */}
        <button
          onClick={() => setIsNotesOpen(false)} // Close the note when clicked
          className="text-white hover:bg-red-600 p-2 rounded-full focus:outline-none"
          title="Close Notes"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body Content */}
      <div className="p-5 flex flex-col h-full">
        {/* Textarea (only visible if not minimized) */}
        {!isMinimized && (
          <textarea
            value={noteContent}
            onChange={handleTextareaChange} // Update the content
            className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 shadow-md"
            placeholder="✏️ Write your note here..."
          />
        )}

        {/* Minimize/Maximize Button */}
        <button
          onClick={() => setIsMinimized((prev) => !prev)} // Toggle minimize state
          className="absolute bottom-2 right-2 p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all"
          title={isMinimized ? 'Expand' : 'Minimize'}
        >
          {isMinimized ? (
            // Downward arrow icon (for expand)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            // Upward arrow icon (for minimize)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>

        {/* Clear Button (Only visible when not minimized) */}
        {!isMinimized && (
          <button
            onClick={() => setNoteContent('')} // Clear the note content
            className="mt-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
            title="Clear Note"
          >
            🧹 Clear
          </button>
        )}
      </div>

      {/* Footer with character count */}
      {!isMinimized && (
        <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>✨ Save your thoughts!</span>
          <span>{noteContent.length}/500</span>
        </div>
      )}
    </div>
  );
};

export default Notes;