import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Edit3 } from 'lucide-react'

const BearEditor = ({ markdownContent = '' }) => {
  const [content, setContent] = useState(markdownContent)
  const [isEditing, setIsEditing] = useState(false)

  const colorScheme = 'light'

  const handlePreviewClick = () => {
    setIsEditing(true)
  }

  const handleEditorBlur = () => {
    // Optional: Auto-exit edit mode when clicking outside
    setIsEditing(false)
  }

  return (
    <div className='h-[75vh] bg-white overflow-hidden'>
      {/* Floating Edit Button */}
      {!isEditing && (
        <button
          onClick={handlePreviewClick}
          className='fixed bottom-6 right-6 z-10 bg-stone-500 hover:bg-stone-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105'
          title='Edit Document'
        >
          <Edit3 size={20} />
        </button>
      )}

      {/* Editor/Preview Area */}
      <div className='h-full'>
        {isEditing
          ? (
            <div className='h-full overflow-auto max-w-4xl mx-auto px-16 py-12' data-color-mode={colorScheme}>
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                preview='edit'
                hideToolbar
                height='100%'
                data-color-mode={colorScheme}
                onBlur={handleEditorBlur}
                style={{
                  backgroundColor: 'white'
                }}
                textareaProps={{
                  placeholder: 'Start writing...',
                  style: {
                    fontSize: '16px',
                    lineHeight: '1.7',
                    fontFamily: 'Satoshi, sans-serif',
                    padding: '48px 64px',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    backgroundColor: 'white',
                    color: '#374151'
                  },
                  autoFocus: true
                }}
              />
              <button
                onClick={() => setIsEditing(false)}
                className='fixed bottom-6 right-6 bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 text-sm font-medium'
              >
                Done
              </button>
            </div>
            )
          : (
            <div
              className='h-full overflow-auto cursor-text bg-white'
              onClick={handlePreviewClick}
            >
              <div className='max-w-4xl mx-auto px-16 py-12'>
                <div
                  className='prose prose-lg prose-gray max-w-none hover:bg-stone-50/30 transition-colors duration-200 rounded-lg p-8 -m-8'
                  data-color-mode={colorScheme}
                >
                  <MDEditor.Markdown
                    source={content}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#374151',
                      fontSize: '16px',
                      lineHeight: '1.7',
                      fontFamily: 'Satoshi, sans-serif'
                    }}
                  />
                </div>
                <div className='text-center text-stone-400 text-sm mt-12 italic'>
                  Click anywhere to edit
                </div>
              </div>
            </div>
            )}
      </div>
    </div>
  )
}

export default BearEditor
