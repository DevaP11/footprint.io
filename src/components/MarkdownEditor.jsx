import React, { useMemo } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { load } from '@tauri-apps/plugin-store'

const BearEditor = ({ markdownContent, setMarkdownContent, bookmarkId, isEditing, setIsEditing }) => {
  const imageUrls = useMemo(() => {
    const urls = new Set()

    let match
    // Matches bare URLs ending with common image extensions
    const urlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg))/gi
    while ((match = urlRegex.exec(markdownContent)) !== null) {
      urls.add(match[1])
    }

    return Array.from(urls)
  }, [markdownContent])

  const colorScheme = 'light'

  // Consistent styling variables
  const containerStyles = 'max-w-4xl mx-auto px-16 py-12'
  const contentStyles = {
    fontSize: '16px',
    lineHeight: '1.7',
    fontFamily: 'Satoshi, sans-serif',
    color: '#374151'
  }

  const handlePreviewClick = () => {
    setIsEditing(true)
  }

  const updateBookmark = async () => {
    const store = await load('store.json', { autoSave: false })
    const listFromStore = (await store.get('bookmarks')) || []

    if (!bookmarkId) {
      console.log('Bookmark Id not found')
      return
    }

    listFromStore
      .find(bookmarks => bookmarks?.id === bookmarkId)
      .description = markdownContent

    await store.set('bookmarks', listFromStore)
    await store.save()
  }

  const handleEditorBlur = () => {
    // Optional: Auto-exit edit mode when clicking outside
    setIsEditing(false)
    updateBookmark()
  }

  return (
    <div className='h-[80vh] overflow-hidden'>
      {/* Editor/Preview Area */}
      <div className='h-full'>
        {isEditing
          ? (
            <div className={`h-full overflow-auto ${containerStyles}`} data-color-mode={colorScheme}>
              <MDEditor
                value={markdownContent}
                onChange={(val) => {
                  setMarkdownContent(val || '')
                  updateBookmark()
                }}
                preview='edit'
                hideToolbar
                height='100%'
                data-color-mode={colorScheme}
                onBlur={handleEditorBlur}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
                textareaProps={{
                  placeholder: 'Start writing...',
                  style: {
                    ...contentStyles,
                    padding: '0',
                    margin: '0',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    minHeight: '100%'
                  },
                  autoFocus: true
                }}
              />
            </div>
          )
          : (
            <div
              className='h-full overflow-auto cursor-text'
              onClick={handlePreviewClick}
            >
              <div className={containerStyles}>
                <div
                  className='prose prose-lg prose-gray max-w-none hover:bg-stone-50/30 transition-colors duration-200 rounded-lg p-8 -m-8'
                  data-color-mode={colorScheme}
                >
                  <MDEditor.Markdown
                    source={markdownContent}
                    style={{
                      backgroundColor: 'transparent',
                      ...contentStyles
                    }}
                  />
                  {/* Image Preview Gallery */}
                  {imageUrls.length > 0 && (
                    <div className='mt-12'>
                      <h2 className='text-lg font-semibold text-stone-700 mb-4'>
                        Images Preview
                      </h2>
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
