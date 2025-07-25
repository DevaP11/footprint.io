import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import { invoke } from '@tauri-apps/api/core'

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

export default function CollectBookmarkForm () {
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
          break
        }
      }

      // If no main content found, use body but clean it up
      if (!content) {
        // Remove more unwanted elements from body
        $('header, footer, nav, aside, .header, .footer, .navigation, .sidebar, .menu, .ad, .advertisement').remove()
        content = $('body').html() || ''
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

      // Convert to markdown
      const markdown = turndownService.turndown(content)

      // Clean up the markdown
      const cleanedMarkdown = markdown
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
        .replace(/^\s+|\s+$/g, '') // Trim whitespace
        .replace(/\[(\s*)\]/g, '') // Remove empty links
        .replace(/!\[\]$$[^)]*$$/g, '') // Remove images without alt text

      console.log('Success !')
      console.log({
        markdown: cleanedMarkdown,
        url,
        title: $('title').text() || 'Scraped Content'
      })
    } catch (error) {
      console.error('Scraping error:', error)
    }
  }

  const scrapeWrapper = (e) => {
    handleScrape(e)
      .then(res => {
        console.log(res)
      })
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
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
              <Button type='submit' className='w-full'>
                Submit
              </Button>
            </div>
          </form>
          <div className='bg-muted relative hidden md:block'>
            <img
              src='https://images.unsplash.com/photo-1541269676894-e7edc07ec4b1'
              alt='Image'
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking submit, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  )
}
