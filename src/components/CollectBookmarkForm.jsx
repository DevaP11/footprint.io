import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import { invoke } from '@tauri-apps/api/core'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { HoverMeButton } from '@/components/eldoraui/hoverMe'
import { load } from '@tauri-apps/plugin-store'

// Convert HTML to Markdown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-'
})

async function fetchWebpage (url) {
  try {
    const result = await invoke('fetch_webpage_content', { url })

    return result?.html
  } catch (error) {
    console.error('Failed to invoke command:', error)
    return null
  }
}

const validateUrl = (url) => {
  let loadUrl
  try {
    loadUrl = new URL(url)
  } catch {
    return false
  }
  if (loadUrl) {
    return true
  } else {
    return false
  }
}

export default function CollectBookmarkForm ({ addBookmark, setAddBookmark, setMarkdownContent }) {
  const [url, setUrl] = useState('')

  const handleScrape = async (e) => {
    e.preventDefault()
    console.log('')

    if (!url?.trim()) {
      console.log('Please enter a URL')
      return
    }

    // Add protocol if missing
    let formattedUrl = url.trim()
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }

    console.log(`Url formatted - ${formattedUrl}`)

    if (!validateUrl(formattedUrl)) {
      console.log('Please enter a valid URL')
      return
    }

    try {
      if (!url) {
        console.log({ error: 'URL is required' }, { status: 400 })
        return
      }

      // Fetch the webpage
      const html = await fetchWebpage(url)
      console.log(html)

      const $ = cheerio.load(html)

      // Remove unwanted elements
      $(
        'script, style, nav, header, footer, aside, .advertisement, .ads, .social-share, .comments, .cookie-banner, .popup'
      ).remove()

      // Try to find the main content area
      let content = ''
      const contentSelectors = [
        'main',
        'article',
        '.content',
        '.post-content',
        '.entry-content',
        '.article-content',
        '#content',
        '.main-content',
        '.post-body',
        '.article-body'
      ]

      for (const selector of contentSelectors) {
        const element = $(selector).first()
        if (element.length && element.text().trim().length > 100) {
          content = element.html() || ''
          continue
        }
      }

      // If no main content found, use body but clean it up
      if (!content) {
        // Remove more unwanted elements from body
        $('header, footer, nav, aside, .header, .footer, .navigation, .sidebar, .menu, .ad, .advertisement').remove()
        content = ($('body').html() + $('head').html()) || ''
      }

      // Add custom rules for better conversion
      turndownService.addRule('removeEmptyElements', {
        filter: (node) => {
          return node.nodeName === 'DIV' && !node.textContent?.trim()
        },
        replacement: () => ''
      })

      turndownService.addRule('cleanImages', {
        filter: 'img',
        replacement: (content, node) => {
          const alt = (node).getAttribute('alt') || ''
          const src = (node).getAttribute('src') || ''
          return src ? `![${alt}](${src})` : ''
        }
      })

      turndownService.addRule('githubLink', {
        filter: (node) =>
          node.nodeName === 'A' &&
          node.getAttribute('href')?.includes('github.com') &&
          node.innerHTML?.trim() !== '',

        replacement: (content, node) => {
          const href = node.getAttribute('href')
          return `**[GitHub Link: ${content}](${href})**`
        }
      })

      // Convert to markdown
      const markdown = turndownService.turndown(content)

      // Clean up the markdown
      const cleanedMarkdown = markdown
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
        .replace(/^\s+|\s+$/g, '') // Trim whitespace
        .replace(/\[(\s*)\]/g, '') // Remove empty links

      console.log('Success !')
      console.log({
        markdown: cleanedMarkdown,
        url,
        title: $('title').text() || 'Scraped Content'
      })

      const store = await load('store.json', { autoSave: false })
      const listFromStore = (await store.get('bookmarks')) || []

      listFromStore.push({
        title: 'We live in Time',
        description: cleanedMarkdown,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        size: 'default'
      })

      await store.set('bookmarks', listFromStore)
      console.log('saving content', listFromStore)
      await store.save()

      return cleanedMarkdown
    } catch (error) {
      console.error('Scraping error:', error)
    }
  }

  const scrapeWrapper = (e) => {
    handleScrape(e)
      .then(res => {
        console.log('response', res)
        setMarkdownContent(res)
        setAddBookmark(false)
      })
  }

  return (
    <Dialog open={addBookmark} onOpenChange={() => setAddBookmark(false)} className='flex flex-col gap-3'>
      <DialogTitle />
      <DialogDescription />
      <DialogContent className='sm:max-w-[55vw] place-self-center [&>button]:hidden  rounded-3xl p-4 m-1'>
        <Card className='relative h-full rounded-2xl border p-0 md:rounded-3xl md:p-0'>
          <GlowingEffect
            blur={0}
            borderWidth={3}
            spread={80}
            glow
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <CardContent className='grid p-0 md:grid-cols-1'>
            <form className='p-6 md:p-8' onSubmit={scrapeWrapper}>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-bold'>Enter Bookmark</h1>
                  <p className='text-muted-foreground text-balance'>
                    Paste your bookmark url here!
                  </p>
                </div>
                <div className='grid gap-3'>
                  <Label htmlFor='url'>URL</Label>
                  <Input
                    id='url'
                    type='string'
                    placeholder='https://example.com'
                    required
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className='w-[100%] h-[100%] flex flex-col items-center text-center'>
                  <HoverMeButton type='submit' text='Submit' />
                </div>
              </div>
            </form>
            <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mb-4'>
              By clicking submit, you agree to our <a href='#'>Terms of Service</a>{' '}
              and <a href='#'>Privacy Policy</a>.
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
