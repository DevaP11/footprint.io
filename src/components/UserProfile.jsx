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
        <div className='absolute right-12 top-24 font-extralight text-xl text-stone-700'>Welcome Deva !</div>
      </CardContent>
    </Card>
  )
}
