import './App.css'
import { load } from '@tauri-apps/plugin-store'
import { useEffect, useState } from 'react'
import Bookmark from '@/components/Bookmark'
import { Search, Plus, Menu, PackageOpen } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import CollectBookmarkForm from '@/components/CollectBookmarkForm'
import BearEditor from '@/components/MarkdownEditor'
import AccountMenu from '@/components/AccountMenu'
import { FloatingDock } from '@/components/ui/floating-dock'
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2
} from '@tabler/icons-react'

const links = [
  {
    title: 'Home',
    icon: (
      <IconHome className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  },

  {
    title: 'Products',
    icon: (
      <IconTerminal2 className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  },
  {
    title: 'Components',
    icon: (
      <IconNewSection className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  },
  {
    title: 'Aceternity UI',
    icon: (
      <img
        src='https://assets.aceternity.com/logo-dark.png'
        width={20}
        height={20}
        alt='Aceternity Logo'
      />
    ),
    href: '#'
  },
  {
    title: 'Changelog',
    icon: (
      <IconExchange className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  },

  {
    title: 'Twitter',
    icon: (
      <IconBrandX className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  },
  {
    title: 'GitHub',
    icon: (
      <IconBrandGithub className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  }
]

function chunkArray (arr, chunkSize) {
  const result = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  console.log(result)
  return result
}

function App () {
  const [collection, setCollection] = useState('home')
  const [activeTab, setActiveTab] = useState('home')
  const [addBookmark, setAddBookmark] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [markdownContent, setMarkdownContent] = useState('')
  const [bookmarkId, setBookmarkId] = useState('')
  const [bookmarkList, setBookmarkList] = useState([])

  useEffect(() => {
    console.log('rerendering....')
    const loadList = async () => {
      const store = await load('store.json', { autoSave: false })
      let listFromStore = await store.get('bookmarks')
      listFromStore = listFromStore?.filter(bookmark => bookmark.collection?.includes(collection))
      setBookmarkList(listFromStore)
      markdownContent ? setActiveTab('editor') : setActiveTab('home')
    }

    loadList()
  }, [markdownContent]) /** Change every time a markdown content is set */

  // const isOverflowHidden = activeTab === 'editor' ? 'overflow-hidden' : 'overflow-fixed'
  return (
    <main className='ml-[8vw] mr-[8vw] mt-8 overflow-hidden w-[84vw]'>
      <Tabs value={activeTab} onValueChange={() => { setActiveTab('home') }}>
        <div className='flex flex-col'>
          <div className='flex flex-row mb-0 w-full justify-between mb-2'>
            <TabsList className='bg-stone-200'>
              <TabsTrigger value='home' className='font-extralight bg-stone-200 data-[state=active]:bg-stone-300 data-[state=active]:shadow-md'>
                footprint.io
              </TabsTrigger>
            </TabsList>
            <div className='align-middle'>
              <Button
                type='icon'
                className='bg-stone-300 hover:bg-stone-200 text-black shadow-none mr-2 h-8 w-30  font-extralight'
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Search strokeWidth={1} /> Search
              </Button>
              <Button
                type='icon'
                className='bg-stone-300 hover:bg-stone-200 text-black shadow-none mr-2 h-8 font-extralight'
                onClick={(e) => {
                  e.stopPropagation()
                  setAddBookmark(true)
                }}
              >
                <Plus strokeWidth={1} /> Add
              </Button>
              <Button
                type='icon'
                className='bg-stone-300 hover:bg-stone-200 text-black shadow-none mr-2 h-8 font-extralight'
                onClick={(e) => {
                  e.stopPropagation()
                  setIsAccountMenuOpen(!isAccountMenuOpen)
                }}
              >
                <Menu strokeWidth={1} />
              </Button>
              <AccountMenu isAccountMenuOpen={isAccountMenuOpen} setIsAccountMenuOpen={setIsAccountMenuOpen} />
            </div>
          </div>
          <CollectBookmarkForm
            addBookmark={addBookmark}
            setAddBookmark={setAddBookmark}
            setMarkdownContent={setMarkdownContent}
            setBookmarkId={setBookmarkId}
          />
          <TabsContent value='home'>
            {
              bookmarkList?.length === 0 && (
                <div className='grid grid-cols-1 grid-rows-1 h-[75vh]'>
                  <span className='place-self-center text-stone-600'>
                    <PackageOpen size={48} strokeWidth={0.5} />
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
                          <div className='grid grid-cols-4 auto-rows-fr h-[75vh] gap-4 z-0 mt-0' key={`bookmark-${index}`}>
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
            />
          </TabsContent>
        </div>
      </Tabs>
      <FloatingDock
        items={links}
        setCollection={setCollection}
      />
    </main>
  )
}

export default App
