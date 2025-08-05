import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect, useRef } from 'react'
import bookmarkLeaf from '@/assets/bookmarks-leaf.png'
import { cn } from '@/lib/utils'

function Bookmark ({ size, id, title, description, image }) {
  const [scrollPosition, setScrollPosition] = useState(() => {
    const saved = window?.localStorage.getItem(`bookmark-scroll-${id}`)
    return saved ? JSON.parse(saved) : { x: 0, y: 0 }
  })

  const scrollContainerRef = useRef(null)

  const sizeClasses = {
    large: 'col-span-2 row-span-2',
    wide: 'col-span-2',
    tall: 'row-span-2',
    default: 'col-span-1 row-span-1'
  }

  const handleScroll = (e) => {
    const newPosition = {
      x: e.target.scrollLeft,
      y: e.target.scrollTop
    }
    setScrollPosition(newPosition)
    window?.localStorage.setItem(`bookmark-scroll-${id}`, JSON.stringify(newPosition))
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollPosition.x
      scrollContainerRef.current.scrollTop = scrollPosition.y
    }
  }, [scrollPosition])

  return (
    <div
      className={cn(
        'shadow-input flex flex-col justify-between space-y-4 bg-stone-100 p-1 transition duration-200 hover:shadow-2xl  shadow-stone-400 dark:border-white/[0.2] dark:bg-black dark:shadow-none',
        `relative rounded-2xl overflow-hidden ${sizeClasses[size]}`
      )}
    >
      <Card className='p-0 h-full'>
        <CardContent className='p-0 w-full h-full overflow-hidden rounded-lg'>
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className='w-full h-full overflow-auto rounded-lg'
          >
            <img
              src={image || bookmarkLeaf}
              className='min-w-[150%] min-h-[150%] object-cover rounded-lg'
              alt='Bookmark'
              draggable={false}
            />
          </div>

          {/* Title + Description Overlay */}
          <div className='absolute bottom-0 right-0 m-3 bg-neutral-200/85 text-neutral-800 rounded-md px-3 py-2 shadow-md max-w-[82%]'>
            <div className='text-sm font-semibold truncate mt-2 mb-2 text-neutral-600 dark:text-neutral-200'>{title}</div>
            <div className='text-xs opacity-70 line-clamp-2 text-xs font-normal text-neutral-600 dark:text-neutral-300'>{description}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Bookmark
