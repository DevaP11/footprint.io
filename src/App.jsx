import './App.css'
import { ProgressiveBlur } from '@/components/magicui/progressive-blur'
import { load } from '@tauri-apps/plugin-store'
import { useEffect, useState } from 'react'
import Bookmark from '@/components/Bookmark'
import { Search, Plus, Menu, Edit, Book } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import CollectBookmarkForm from '@/components/CollectBookmarkForm'
import Searchbox from '@/components/Searchbox'
import BearEditor from '@/components/MarkdownEditor'
import AccountMenu from '@/components/AccountMenu'
import { FloatingDock } from '@/components/ui/floating-dock'
import { IconEdit, IconBook } from '@tabler/icons-react'
import PreferencesBanner from '@/components/PreferencesBanner'
import { NoDataSvg } from '@/assets/SvgList'

function chunkArray(arr, chunkSize) {
  const result = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}

function App() {
  const [activeTab, setActiveTab] = useState('preferences')
  const [addBookmark, setAddBookmark] = useState(false)
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [markdownContent, setMarkdownContent] = useState('')
  const [bookmarkId, setBookmarkId] = useState('')
  const [bookmarkList, setBookmarkList] = useState([])
  const [isEditing, setIsEditing] = useState(false)

  const editButton = {
    title: 'Edit',
    icon: (
      <IconEdit className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#',
    onClick: () => {
      setIsEditing(true)
    }
  }

  const deleteButton = {
    title: 'Delete',
    icon: (
      <IconEdit className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    onClick: (e) => {
      const updateBookmark = async (list) => {
        const store = await load('store.json', { autoSave: false })
        await store.set('bookmarks', list)
        await store.save()
      }

      const listAfterDeleting = bookmarkList?.filter(b => b?.id !== bookmarkId)
      updateBookmark(listAfterDeleting)
        .then(() => {
          setBookmarkList(listAfterDeleting)
          setActiveTab('home')
        })
    }
  }

  const previewButton = {
    title: 'Preview',
    icon: (
      <IconBook className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#',
    onClick: () => {
      setIsEditing(false)
    }
  }

  const markdownMenu = isEditing ? [previewButton] : [editButton, deleteButton]

  useEffect(() => {
    const loadList = async () => {
      const store = await load('store.json', { autoSave: false })
      let listFromStore = await store.get('bookmarks')
      setBookmarkList(listFromStore)
      markdownContent ? setActiveTab('editor') : setActiveTab('home')
    }

    loadList()
  }, [markdownContent]) /** Change every time a markdown content  is set */

  return (
    <main id='root'>
      <div className='ml-[8vw] mr-[8vw] pt-8 overflow-hidden w-[84vw]'>
        <Tabs value={activeTab} onValueChange={() => { setActiveTab('home') }}>
          <div className='flex flex-col'>
            <div className='grid grid-rows-1 grid-cols-24 gap-4 w-[100%]'>
              <TabsList className='bg-white-100 col-span-6 border-gray-50 border-1'>
                <TabsTrigger value='home' className='font-light text-white p-0'>
                  <Button
                    type='icon'
                    className={`bg-[#3D4127] col-start-3 col-span-2
                      text-white shadow-none
                      relative overflow-hidden
                      bg-[#3D4127] backdrop-blur-md
                      border border-stone-900/20
                      transition-all duration-300 ease-out
                      hover:bg-[#636B2F] hover:border-[#636B2F]/30
                      shadow-sm shadow-black/25
                      hover:shadow-sm hover:shadow-black/30
                      hover:scale-105
                      active:scale-95
                      group
                      font-medium leading-[0.8]`}
                  >
                    footprint.io
                  </Button>
                </TabsTrigger>
              </TabsList>
              <Button
                type='icon'
                className={`text-black shadow-none col-span-12
                relative overflow-hidden
                bg-transparent backdrop-blur-md
                border border-red/20
                hover:bg-transparent hover:border-red/30
                shadow-xml shadow-black/25
                hover:shadow-sm hover:shadow-black/30
                transition-all duration-300 ease-out
                hover:scale-105
                active:scale-95
                group
                font-extralight`}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsSearchBoxOpen(true)
                }}
              >
                <Search strokeWidth={1} /> Search
              </Button>
              <div className='grid grid-rows-1 grid-cols-5 gap-2 col-span-6'>
                <Button
                  type='icon'
                  className={`bg-stone-900 col-start-3 col-span-2
                    text-white shadow-none
                    relative overflow-hidden
                    bg-stone-900 backdrop-blur-md
                    border border-stone-900/20
                    shadow-xml shadow-black/25
                    transition-all duration-300 ease-out
                    hover:bg-stone-900 hover:border-red/30
                    hover:shadow-xl hover:shadow-black/30
                    hover:scale-105
                    active:scale-95
                    group
                    font-extralight`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setAddBookmark(true)
                  }}
                >
                  <Plus strokeWidth={1} /> Add
                </Button>
                <div> {/** Account menu */}
                  <Button
                    type='icon'
                    className={`bg-white-300 border hover:bg-white-200
                      transition-all duration-300 ease-out
                      hover:scale-105
                      active:scale-95
                      group
                      text-black shadow-none col-start-5 col-span-1 font-extralight mr-1.5`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsAccountMenuOpen(!isAccountMenuOpen)
                    }}
                  >
                    <Menu strokeWidth={1} />
                  </Button>
                  <AccountMenu
                    isAccountMenuOpen={isAccountMenuOpen}
                    setIsAccountMenuOpen={setIsAccountMenuOpen}
                    setActiveTab={setActiveTab}
                  />
                </div>
              </div>
            </div>
            <CollectBookmarkForm
              addBookmark={addBookmark}
              setAddBookmark={setAddBookmark}
              setMarkdownContent={setMarkdownContent}
              setBookmarkId={setBookmarkId}
            />
            <Searchbox
              bookmarks={bookmarkList}
              isSearchBoxOpen={isSearchBoxOpen}
              setIsSearchBoxOpen={setIsSearchBoxOpen}
              setMarkdownContent={setMarkdownContent}
              setBookmarkId={setBookmarkId}
            />
            <TabsContent value='home'>
              {
                bookmarkList?.length === 0 && (
                  <div className='grid grid-cols-1 grid-rows-1 h-[75vh] pr-4'>
                    <span className='place-self-center text-stone-600'>
                      <NoDataSvg
                        height={50}
                      />
                    </span>
                  </div>
                )
              }
              {
                bookmarkList?.length !== 0 && (
                  <div className='flex flex-col'>
                    {
                      chunkArray(bookmarkList, 6)
                        ?.map((bookmarkArray, index) => {
                          return (
                            <div className='grid grid-cols-4 auto-rows-fr h-[75vh] gap-4 z-0 mt-4' key={`bookmark-${index}`}>
                              {
                                bookmarkArray?.map((bookmarkItem, index) => {
                                  const indexToCalculate = index <= 5 ? index : index % 5
                                  const template = ['large', 'wide', 'default', 'tall', 'wide', 'default']
                                  const size = template[indexToCalculate]
                                  return (
                                    <Bookmark
                                      setMarkdownContent={setMarkdownContent}
                                      key={index}
                                      id={index}
                                      title={bookmarkItem?.title}
                                      description={bookmarkItem?.description}
                                      image={bookmarkItem?.image}
                                      size={size}
                                      bookmarkId={bookmarkItem?.id}
                                      setBookmarkId={setBookmarkId}
                                    />
                                  )
                                })
                              }
                            </div>
                          )
                        })
                    }
                  </div>
                )
              }
            </TabsContent>
            <TabsContent key='editor' value='editor'>
              <BearEditor
                markdownContent={markdownContent}
                setMarkdownContent={setMarkdownContent}
                bookmarkId={bookmarkId}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            </TabsContent>
            <TabsContent key='preferences' value='preferences'>
              <PreferencesBanner />
            </TabsContent>
          </div>
        </Tabs>
        <div className='flex flex-row justify-center'>
          <ProgressiveBlur position='bottom' height='10%' className='fixed bottom-20 z-1' />
          <FloatingDock
            desktopClassName='fixed bottom-6 z-2'
            mobileClassName='fixed bottom-6'
            items={activeTab === 'editor' ? markdownMenu : []}
            setActiveTab={setActiveTab}
          />
        </div>
      </div >
    </main >
  )
}

export default App
