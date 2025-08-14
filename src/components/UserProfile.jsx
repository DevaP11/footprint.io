import { Card, CardContent } from '@/components/ui/card'
import bookmarkLeaf from '@/assets/bookmarks-leaf.png'

export default function UserProfile () {
  return (
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
            footprint.io
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
