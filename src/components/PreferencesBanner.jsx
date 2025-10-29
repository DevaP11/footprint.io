import { Card, CardContent } from '@/components/ui/card'
import bookmarkLeaf from '@/assets/bookmarks-leaf.png'
import { useEffect, useState } from 'react'
import { load } from '@tauri-apps/plugin-store'

export default function PreferencesBanner() {
  const [bookmarkList, setBookmarkList] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(true)
  useEffect(() => {
    const loadList = async () => {
      const store = await load('store.json', { autoSave: false })
      let listFromStore = await store.get('bookmarks')

      let total = 0
      listFromStore.forEach(b => {
        total += b.description.length
      })
      setCount(total)
      setBookmarkList(listFromStore)
      setLoading(false)
    }

    loadList()
  }, [])

  return (
    <div className='flex flex-col gap-8'>
      <Card className='relative h-full p-0 md:p-0 mt-4'>
        <CardContent className='p-0 w-full h-full overflow-hidden rounded-lg relative'>
          <img
            src={bookmarkLeaf}
            className='object-cover rounded-lg'
            alt='Cover Image'
            draggable={false}
          />
          <div className='absolute inset-0 flex items-center justify-end mr-12'>
            <div className='font-extralight text-lg sm:text-xl md:text-2xl lg:text-3xl text-stone-700 text-center px-4'>
              Statistics
            </div>
          </div>
        </CardContent>
      </Card>
      <div className='flex flex-row gap-4 md:gap-8 w-full'>
        {!loading && <Card className='bg-[#EFEFEF]  w-[100%]'>
          <CardContent className='p-0 m-0 rounded-lg'>
            <div className='flex flex-row px-10 justify-center'>
              <div className='space-y-2 text-xs'>
                <div className='flex flex-col gap-2 md:gap-6 md:m-8'>
                  <div className='flex flex-col items-end'>
                    <h2 className='text-xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold flex items-end'>
                      {bookmarkList?.length}
                    </h2>
                    <span className='text-sm font-extralight'>Entires</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>}
        {!loading && <Card className='bg-[#EFEFEF] w-[100%]'>
          <CardContent className='p-0 m-0 rounded-lg'>
            <div className='flex flex-row px-10 justify-center'>
              <div className='space-y-2 text-xs'>
                <div className='flex flex-col gap-2 md:gap-6 md:m-8'>
                  <div className='flex flex-col items-end'>
                    <h2 className='text-xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold flex items-start'>
                      {count}
                    </h2>
                    <span className='text-sm font-extralight'>Characters</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>}
      </div>
    </div>
  )
}
