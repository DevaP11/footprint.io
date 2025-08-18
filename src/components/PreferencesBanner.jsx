import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import bookmarkLeaf from '@/assets/bookmarks-leaf.png'

export default function PreferencesBanner () {
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
        <CardContent className='p-4 rounded-lg'>
          <div className='ml-8 flex h-5 items-center space-x-4 text-sm'>
            <div>Blog</div>
            <Separator orientation='vertical' className='bg-stone-900' />
            <div>Docs</div>
            <Separator orientation='vertical' className='bg-stone-900' />
            <div>Source</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
