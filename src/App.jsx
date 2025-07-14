import './App.css'
import { useState } from 'react'
import BookmarkListing from '@/components/BookmarkListing'
import { Search, Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
function App() {
  const [activeTab, setActiveTab] = useState('bookmarks')
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const isTabBookmarks = activeTab === "bookmarks"
  return (
    <main className='grid grid-cols-1 gap-4 bg-background text-foreground ml-10 mt-12 max-w-[90vw]'>
      <Tabs value={activeTab} onValueChange={handleTabChange} className='place-self-center mt-8'>
        <div className='flex flex-row  mb-0 w-full justify-between'>
          <TabsList className="bg-stone-200">
            <TabsTrigger value='home' className="font-extralight bg-stone-200 data-[state=active]:bg-stone-300 data-[state=active]:shadow-md">Home</TabsTrigger>
            <TabsTrigger value='bookmarks' className="font-extralight bg-stone-200 data-[state=active]:bg-stone-300 data-[state=active]:shadow-md">Bookmarks</TabsTrigger>
          </TabsList>
          <div className='align-middle'>
            {isTabBookmarks && <Button
              type='icon'
              className='bg-stone-200 hover:bg-stone-100 text-black shadow-none mr-2 h-8 w-30  font-extralight'
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Search /> Search
            </Button>}
            {isTabBookmarks && <Button
              type='icon'
              className='bg-stone-300 hover:bg-stone-200 text-black shadow-none mr-2 h-8  font-extralight'
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Plus /> Add
            </Button>}
          </div>
        </div>
        <TabsContent value='home' className='w-[76vw]'>
          <p>Home</p>
        </TabsContent>
        <TabsContent value='bookmarks' className='w-[76vw]'>
          <BookmarkListing />
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default App
