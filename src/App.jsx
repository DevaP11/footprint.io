import './App.css'
import { useState } from 'react'
import Bookmark from '@/components/Bookmark'
import { Search, Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
// import CollectBookmarkForm from '@/components/CollectBookmarkForm'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Editor } from '@/components/blocks/editor-00/editor.tsx'
const bookmarkList = [
  {
    title: 'Data-Backed Strategy',
    description: 'We craft marketing plans built on real insights, not guesswork—so every move has purpose.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    size: 'large'
  },
  {
    title: 'Targeted Campaigns',
    description: 'Reach the right audience at the right time with campaigns that convert across every platform.Reach the right audience at the right time with campaigns that convert across every platform.Reach the right audience at the right time with campaigns that convert across every platform.Reach the right audience at the right time with campaigns that convert across every platform.Reach the right audience at the right time with campaigns that convert across every platform.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    size: 'wide'
  },
  {
    title: 'Social Media Management',
    description: 'From content calendars to engagement boosts.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71',
    size: 'default'
  },
  {
    title: 'SEO & Content Marketing',
    description: 'Boost visibility and authority with content that ranks, resonates, and delivers long-term value.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    size: 'tall'
  },
  {
    title: 'Creative Branding',
    description: 'Stand out with bold visuals, sharp messaging, and a brand identity that sticks.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    size: 'wide'
  },
  {
    title: 'Performance Analytics',
    description: 'Track results in real-time and adapt fast—because great marketing never stands still.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    size: 'default'
  }
]

function App () {
  const tags = ['Campaigns', 'Movies']

  const [activeTab, setActiveTab] = useState(tags[0])
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  return (
    <main className='grid grid-cols-1 gap-4 bg-background text-foreground mt-4 place-self-center max-w-[90vw]'>
      <Dialog>
        <Tabs value={activeTab} onValueChange={handleTabChange} className='place-self-center mt-8'>
          <div className='flex flex-row  mb-0 w-full justify-between'>
            <TabsList className='bg-stone-200'>
              {
                tags?.map((t, i) => {
                  return (
                    <TabsTrigger key={`tags_trigger_${i}`} value={t} className='font-extralight bg-stone-200 data-[state=active]:bg-stone-300 data-[state=active]:shadow-md'>
                      {t}
                    </TabsTrigger>
                  )
                })
              }
            </TabsList>
            <div className='align-middle'>
              <Button
                type='icon'
                className='bg-stone-200 hover:bg-stone-100 text-black shadow-none mr-2 h-8 w-30  font-extralight'
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Search /> Search
              </Button>
              <DialogTrigger asChild>
                <Button
                  type='icon'
                  className='bg-stone-300 hover:bg-stone-200 text-black shadow-none mr-2 h-8  font-extralight'
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Plus /> Add
                </Button>
              </DialogTrigger>
            </div>
          </div>
          <DialogContent className='sm:max-w-[65vw] place-self-center'>
            {/* <CollectBookmarkForm /> */}
            <Editor />
          </DialogContent>
          {
            tags.map((t, i) => {
              return (
                <TabsContent key={`tags_content_${i}`} value={t} className='w-[86vw]'>
                  <div className='grid grid-cols-4 grid-rows-4 gap-4 h-screen z-0'>
                    {
                      bookmarkList?.map((bookmarkItem, index) => {
                        return (
                          <Bookmark
                            key={index}
                            id={index}
                            title={bookmarkItem?.title}
                            description={bookmarkItem?.description}
                            image={bookmarkItem?.image}
                            size={bookmarkItem?.size}
                          />
                        )
                      })
                    }
                  </div>
                </TabsContent>
              )
            })
          }
        </Tabs>
      </Dialog>
    </main>
  )
}

export default App
