import { useEffect, useState, useMemo, useCallback } from 'react'
import MiniSearch from 'minisearch'
import { Card, CardContent } from '@/components/ui/card'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { IconBrandGithub, IconBrandX, IconExchange, IconHome, IconNewSection, IconTerminal2 } from '@tabler/icons-react'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { CommandSeparator } from 'cmdk'
import { Particles } from '@/components/magicui/particles'

const links = [
  {
    title: 'All',
    icon: (
      <IconHome className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  },

  {
    title: 'Products',
    icon: (
      <IconTerminal2 className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  },
  {
    title: 'Components',
    icon: (
      <IconNewSection className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  },
  {
    title: 'Aceternity UI',
    icon: (
      <img
        src='https://assets.aceternity.com/logo-dark.png'
        width={20}
        height={20}
        alt='Aceternity Logo'
      />
    ),
    href: '#'
  },
  {
    title: 'Changelog',
    icon: (
      <IconExchange className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  },

  {
    title: 'Twitter',
    icon: (
      <IconBrandX className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  },
  {
    title: 'GitHub',
    icon: (
      <IconBrandGithub className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '#'
  }
]

export default function Searchbox ({ bookmarks, isSearchBoxOpen, setIsSearchBoxOpen, setMarkdownContent, setBookmarkId }) {
  const [inputValue, setInputValue] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isIndexed, setIsIndexed] = useState(false)

  // Create and configure MiniSearch instance
  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: ['title', 'collection', 'id', 'description'],
      storeFields: ['title', 'collection', 'id', 'description'], // Include id for better key handling
      searchOptions: {
        prefix: false,
        boost: { title: 2 } // Boost title matches
      }
    })
    return ms
  }, [])

  // Index bookmarks when they change
  useEffect(() => {
    const indexBookmarks = () => {
      try {
        if (bookmarks.length > 0) {
          setIsLoading(true)

          // Clear existing index
          miniSearch.removeAll()

          // Add documents with proper ID handling
          const documentsToIndex = bookmarks.map((bookmark, index) => ({
            id: bookmark.id || index, // Ensure each document has an ID
            ...bookmark
          }))

          miniSearch.addAll(documentsToIndex)
          setIsIndexed(true)

          console.log(`Indexed ${documentsToIndex.length} bookmarks`)
        }
      } catch (error) {
        console.error('Error indexing bookmarks:', error)
        setIsIndexed(false)
      } finally {
        setIsLoading(false)
      }
    }
    indexBookmarks()
  }, [bookmarks, miniSearch])

  // Debounced search function
  const performSearch = useCallback(
    (query) => {
      if (!isIndexed || query.trim() === '') {
        setResults([])
        return
      }

      try {
        const searchResults = miniSearch.search(query, {
          limit: 10
          // You can add more search options here
        })

        setResults(searchResults)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      }
    },
    [miniSearch, isIndexed]
  )

  // Handle input changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(inputValue)
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [inputValue, performSearch])

  return (
    <Dialog open={isSearchBoxOpen} onOpenChange={() => setIsSearchBoxOpen(false)} className='flex flex-col gap-3'>
      <DialogTitle />
      <DialogDescription />
      <DialogContent className='sm:max-w-[56vw] md:min-w-[550px] place-self-center [&>button]:hidden rounded-[calc(var(--radius-inner)+var(--padding-value))] p-[var(--padding-value)] p-4 m-1 bg-[linear-gradient(155deg,#fdfcfb_40%,#e2d1c3_100%)]'>
        <Card className='relative h-full rounded-[var(--radius-inner)] p-0 md:p-0 bg-transparent'>
          <GlowingEffect
            blur={0}
            borderWidth={3}
            spread={80}
            glow
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <Particles
            className='absolute inset-0 z-0'
            quantity={60}
            ease={80}
            color='green'
            refresh
          />
          <CardContent className='grid p-0 md:grid-cols-1'>
            <form className='p-6 md:p-8' onSubmit={() => { }}>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-bold mb-0'>Search</h1>
                  <p className='text-muted-foreground text-balance md:hidden'>
                    Search Bookmarks !
                  </p>
                </div>
                <div className='grid gap-3'>
                  <Command className='bg-transparent rounded-lg border-none shadow-none md:min-w-[450px] max-h-[18vh]' shouldFilter={false}>
                    <CommandInput
                      placeholder='Start typing ...'
                      value={inputValue}
                      onValueChange={setInputValue}
                    />
                    <CommandList>
                      {/* Remove CommandEmpty temporarily */}

                      {/* Always render the group, conditionally render content */}
                      {inputValue &&
                        <CommandGroup heading='Search Results'>
                          {results.length === 0 && inputValue.trim() !== ''
                            ? (
                              <div className='p-2 text-sm text-muted-foreground'>
                                No results found for "{inputValue}"
                              </div>
                              )
                            : (
                                results.map((result, index) => {
                                  const matchingLink = links.find(l =>
                                    l.title?.toLowerCase() === result.collection?.toLowerCase()
                                  )

                                  return (
                                    <CommandItem
                                      key={`result-${result?.id}`}
                                      onSelect={() => {
                                        setMarkdownContent(result?.description)
                                        setBookmarkId(result?.id)
                                        setIsSearchBoxOpen(false)
                                      }}
                                    >
                                      {matchingLink?.icon}
                                      <span>{result.title}</span>
                                    </CommandItem>
                                  )
                                })
                              )}
                        </CommandGroup>}

                      <CommandSeparator />

                      {isLoading && (
                        <CommandGroup heading='Loading...' />
                      )}

                      {!isLoading && inputValue.trim() === '' && (
                        <CommandGroup heading='Search Results will be displayed here' />
                      )}

                    </CommandList>
                  </Command>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
