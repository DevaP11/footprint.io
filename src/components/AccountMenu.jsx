import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { load } from '@tauri-apps/plugin-store'

export default function AccountMenu ({ isAccountMenuOpen, setIsAccountMenuOpen, setActiveTab }) {
  const clearStore = async () => {
    const store = await load('store.json', { autoSave: false })
    await store.set('bookmarks', [])
    await store.save()
  }

  const hoverStyleForDropdownItem = 'flex justify-end hover:!text-stone-600 hover:!bg-stone-200'
  return (
    <DropdownMenu open={isAccountMenuOpen} onOpenChange={() => { setIsAccountMenuOpen(!isAccountMenuOpen) }}>
      <DropdownMenuTrigger asChild={false} />
      <DropdownMenuContent className='w-42 mt-2 mr-2 p-2 font-extralight text-xs bg-stone-100' align='end'>
        <DropdownMenuLabel className='flex justify-end'>Hi Deva !</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={hoverStyleForDropdownItem}>
          <Button
            variant='ghost'
            size='8'
            className={hoverStyleForDropdownItem}
            onClick={(e) => {
              e.stopPropagation()
              setActiveTab('preferences')
            }}
          >
            <span className='font-extralight text-black-900'>Preferences</span>
          </Button>
        </DropdownMenuItem>
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
