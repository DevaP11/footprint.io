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

export default function AccountMenu () {
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
        <DropdownMenuItem className={hoverStyleForDropdownItem}>Clear Bookmarks</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
