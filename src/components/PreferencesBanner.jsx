import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import bookmarkLeaf from '@/assets/bookmarks-leaf.png'

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
          <div className='flex flex-row w-full justify-around'>
            <div>
              <h3 className='font-semi-bold text-m'>Collections</h3>
              <text className='font-extralight text-sm'>Create collections to organize bookmarks</text>
            </div>
            <div className='ml-8 grid grid-cols-4 auto-rows-fr space-x-4 text-sm h-full'>
              {collections.map((c, i) => {
                return (
                  <div className='grid grid-cols-2 grid-rows-1 gap-2 items-center  mt-2' key={i}>
                    {c.title}
                    {i !== (collections.length - 1) && <Separator orientation='vertical' className='bg-stone-400' />}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
