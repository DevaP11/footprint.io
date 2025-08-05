import { Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { load } from '@tauri-apps/plugin-store'

export default function AccountMenu () {
  const clearStore = async () => {
    const store = await load('store.json', { autoSave: false })
    await store.set('bookmarks', [])
    await store.save()
  }

  const hoverStyleForDropdownItem = 'flex justify-end hover:!text-stone-600 hover:!bg-stone-200'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          type='icon'
          className='bg-stone-300 hover:bg-stone-200 text-black shadow-none mr-2 h-8 font-extralight'
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-42 mt-1 mr-2 p-2 font-extralight text-xs bg-stone-100' align='end'>
        <DropdownMenuLabel className='flex justify-end'>Hi Deva !</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={hoverStyleForDropdownItem}>Preferences</DropdownMenuItem>
        <DropdownMenuItem className={hoverStyleForDropdownItem}>Import</DropdownMenuItem>
        <DropdownMenuItem className={hoverStyleForDropdownItem}>Backup</DropdownMenuItem>
        <DropdownMenuItem className={hoverStyleForDropdownItem}>
          <Button
            variant='ghost'
            size='8'
            className={hoverStyleForDropdownItem}
            onClick={(e) => {
              e.stopPropagation()
              console.log('Clearing Bookmark')
              clearStore()
            }}
          >
            {/** Add an Are You Sure ? dialog */}
            <span className='font-extralight text-red-900'>Clear Bookmarks</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
