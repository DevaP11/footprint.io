import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Edit3 } from 'lucide-react';

const BearEditor = ({ markdownContent }) => {
  const [content, setContent] = useState(markdownContent);

  const [isEditing, setIsEditing] = useState(false);

  const handlePreviewClick = () => {
    setIsEditing(true);
  };

  const handleEditorBlur = () => {
    // Optional: Auto-exit edit mode when clicking outside
    // setIsEditing(false);
  };

  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Floating Edit Button */}
      {!isEditing && (
        <button
          onClick={handlePreviewClick}
          className="fixed top-6 right-6 z-10 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Edit Document"
        >
          <Edit3 size={20} />
        </button>
      )}

      {/* Editor/Preview Area */}
      <div className="h-full">
        {isEditing ? (
          <div className="h-full" data-color-mode="light">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              preview="edit"
              hideToolbar={true}
              height="100%"
              data-color-mode="light"
              onBlur={handleEditorBlur}
              style={{
                backgroundColor: 'white',
              }}
              textareaProps={{
                placeholder: 'Start writing...',
                style: {
                  fontSize: '16px',
                  lineHeight: '1.7',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
                  padding: '48px 64px',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  backgroundColor: 'white',
                  color: '#374151',
                },
                autoFocus: true,
              }}
            />
            <button
              onClick={() => setIsEditing(false)}
              className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 text-sm font-medium"
            >
              Done
            </button>
          </div>
        ) : (
          <div
            className="h-full overflow-auto cursor-text bg-white"
            onClick={handlePreviewClick}
          >
            <div className="max-w-4xl mx-auto px-16 py-12">
              <div
                className="prose prose-lg prose-gray max-w-none hover:bg-gray-50/30 transition-colors duration-200 rounded-lg p-8 -m-8"
                data-color-mode="light"
              >
                <MDEditor.Markdown
                  source={content}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#374151',
                    fontSize: '16px',
                    lineHeight: '1.7',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
                  }}
                />
              </div>
              <div className="text-center text-gray-400 text-sm mt-12 italic">
                Click anywhere to edit
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BearEditor;
