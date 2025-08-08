import React, { useState, useMemo } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Edit3 } from 'lucide-react'

const BearEditor = ({ markdownContent = '' }) => {
  const [content, setContent] = useState(markdownContent)
  const [isEditing, setIsEditing] = useState(false)

  const imageUrls = useMemo(() => {
    const urls = new Set()

    // Matches ![alt](url)
    const mdImageRegex = /!\[[^\]]*\]\((.*?)\)/g
    let match
    while ((match = mdImageRegex.exec(content)) !== null) {
      urls.add(match[1])
    }

    // Matches bare URLs ending with common image extensions
    const urlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg))/gi
    while ((match = urlRegex.exec(content)) !== null) {
      urls.add(match[1])
    }

    return Array.from(urls)
  }, [content])

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
                  {/* Image Preview Gallery */}
                  {imageUrls.length > 0 && (
                    <div className='mt-12'>
                      <h3 className='text-lg font-semibold text-stone-700 mb-4'>
                        📷 Images Preview
                      </h3>
                      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                        {imageUrls.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='block'
                          >
                            <img
                              src={url}
                              alt={`Preview ${idx + 1}`}
                              className='w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
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
