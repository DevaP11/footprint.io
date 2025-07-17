import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"
import bookmarkLeaf from '@/assets/bookmarks-leaf.png'

function Bookmark({ size, id }) {
  const [scrollPosition, setScrollPosition] = useState(() => {
    // This will work in your real project
    const saved = localStorage.getItem(`bookmark-scroll-${id}`);
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });

  const scrollContainerRef = useRef(null);

  const sizeClasses = {
    'large': 'col-span-2 row-span-2',
    'wide': 'col-span-2',
    'tall': 'row-span-2',
    'default': 'col-span-1 row-span-1'
  };

  const handleScroll = (e) => {
    const newPosition = {
      x: e.target.scrollLeft,
      y: e.target.scrollTop
    };
    setScrollPosition(newPosition);

    // Save to localStorage (works in real projects)
    localStorage.setItem(`bookmark-scroll-${id}`, JSON.stringify(newPosition));
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollPosition.x;
      scrollContainerRef.current.scrollTop = scrollPosition.y;
    }
  }, [scrollPosition]);

  return (
    <div className={`rounded-2xl overflow-hidden ${sizeClasses[size]}`}>
      <Card className="p-0 h-full">
        <CardContent className="p-0 w-full h-full overflow-hidden rounded-lg">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="w-full h-full overflow-auto rounded-lg"
          >
            <img
              src={bookmarkLeaf}
              className="min-w-[150%] min-h-[150%] object-cover rounded-lg"
              alt="Bookmark"
              draggable={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Bookmark
