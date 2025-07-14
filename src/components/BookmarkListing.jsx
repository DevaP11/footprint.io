import { Card, CardContent } from "@/components/ui/card"
import bookmarkLeaf from '@/assets/bookmarks-leaf.png'
function BookmarkListing() {
  return (
    <div className=''>
      <Card className="p-0">
        <CardContent className="p-0 max-h-[35vh] w-[full] overflow-auto rounded-lg">
          <img
            src={bookmarkLeaf}
            className=" w-full h-full object-fit rounded-lg"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default BookmarkListing
