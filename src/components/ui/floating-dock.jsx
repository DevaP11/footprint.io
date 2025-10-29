/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/
import { cn } from '@/lib/utils'
import { IconMicroscopeFilled } from '@tabler/icons-react'
import { IconLayoutNavbarCollapse } from '@tabler/icons-react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'

import { useRef, useState } from 'react'

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  setCollection,
  setActiveTab
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} setCollection={setCollection} setActiveTab={setActiveTab} />
      <FloatingDockMobile items={items} className={mobileClassName} setCollection={setCollection} setActiveTab={setActiveTab} />
    </>
  )
}

const FloatingDockMobile = ({
  items,
  className,
  setCollection,
  setActiveTab
}) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId='nav'
            className='absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2'
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05
                  }
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <button
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick()
                    } else {
                      setCollection(item.title?.toLowerCase())
                    }
                  }}
                  className='flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 dark:bg-stone-900'
                >
                  <div className='h-4 w-4'>{<IconMicroscopeFilled />}</div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className='flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 dark:bg-stone-200'
      >
        <IconLayoutNavbarCollapse className='h-5 w-5 text-stone-500 dark:text-stone-600' />
      </button>
    </div>
  )
}

const FloatingDockDesktop = ({
  items,
  className,
  setCollection,
  setActiveTab
}) => {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto hidden h-16 items-end gap-4 rounded-2xl px-4 pb-3 md:flex dark:bg-stone-900',
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.title}
          onClick={() => {
            if (item.onClick) {
              item.onClick()
            } else {
              setCollection(item.title?.toLowerCase())
            }
          }}
        >
          <IconContainer mouseX={mouseX} key={item.title} {...item} />
        </button>
      ))}
    </motion.div>
  )
}

function IconContainer({
  mouseX,
  title,
  href
}) {
  const ref = useRef(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }

    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-120, 0, 120], [60, 120, 60])
  const heightTransform = useTransform(distance, [-120, 0, 120], [60, 120, 60])

  const widthTransformIcon = useTransform(distance, [-120, 0, 120], [30, 60, 30])
  const heightTransformIcon = useTransform(distance, [-120, 0, 120], [30, 60, 30])

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 120,
    damping: 12
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 120,
    damping: 12
  })

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 120,
    damping: 12
  })
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 120,
    damping: 12
  })

  const [hovered, setHovered] = useState(false)

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className='relative flex aspect-square items-center justify-center rounded-full bg-stone-200 dark:bg-stone-200'
      >
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className='flex items-center justify-center'
        >
          {<span className='text-xs font-light '>{title}</span>}
        </motion.div>
      </motion.div>
    </a>
  )
}
