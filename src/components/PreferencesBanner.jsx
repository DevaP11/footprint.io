import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import bookmarkLeaf from '@/assets/bookmarks-leaf.png'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function PreferencesBanner ({ collections }) {
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
              Preferences
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className='bg-[#EFEFEF]'>
        <CardContent className='p-0 m-0 rounded-lg'>
          <div className='flex flex-row w-full justify-between'>
            <div className='ml-8'>
              <h3 className='font-semi-bold text-m'>Collections</h3>
              <text className='font-extralight text-sm'>You can use collections to organize bookmarks</text>
            </div>
            <div className='grid grid-cols-3 auto-rows-fr gap-x-0 gap-y-2 text-xs w-[34vw]'>
              {collections.map((c, i) => {
                return (
                  <div className='grid grid-cols-2 grid-rows-1 gap-x-1 font-extralight' key={i}>
                    {c.title}
                    <Separator orientation='vertical' className='bg-stone-400 max-h-3' />
                  </div>
                )
              })}
              <Button
                type='icon'
                className='bg-transparent hover:bg-stone-200 w-[8px] h-[8px] ml-3 shadow-none text-black'
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Plus strokeWidth={1} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
