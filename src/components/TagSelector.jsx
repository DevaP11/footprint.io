import { useEffect, useState } from "react";
import { X, HelpCircle } from "lucide-react";
import { load } from '@tauri-apps/plugin-store'
import * as Icons from "lucide-react"

// Utility: find most suitable or random icon
const getIconForString = (str) => {
  if (!str || typeof (str) !== "string") return Icons.HelpCircle

  const lowerStr = str.toLowerCase()

  // Try exact match
  for (const key in Icons) {
    if (key.toLowerCase() === lowerStr) {
      return Icons[key]
    }
  }

  // Try partial match
  for (const key in Icons) {
    if (key.toLowerCase().includes(lowerStr)) {
      return Icons[key]
    }
  }

  // No match? → Pick a random icon
  const iconKeys = Object.keys(Icons)
  const randomKey = iconKeys[Math.floor(Math.random() * iconKeys.length)]
  return Icons[randomKey]
}

function getUniqueByTitle(arr) {
  const seen = new Map();

  return arr.filter(obj => {
    if (!seen.has(obj.title)) {
      seen.set(obj.title, true);
      return true;
    }
    return false;
  });
}


const TagInput = () => {
  const [tags, setTags] = useState([])
  const [tagToRemove, setTagToRemove] = useState("")
  const [tagToAdd, setTagToAdd] = useState("")
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    const updateCollections = async () => {
      const store = await load('store.json', { autoSave: false })
      let collectionFromStore = (await store.get('collections')) || []

      setTags(collectionFromStore?.map(c => c.title))
      collectionFromStore.forEach((c, index) => {
        if (c.title === tagToRemove) {
          collectionFromStore.splice(index, 1)
        }
      })
      if (tagToAdd) {
        collectionFromStore.push({ title: tagToAdd })
      }
      console.log("Saving Collections....", collectionFromStore)
      collectionFromStore = getUniqueByTitle(collectionFromStore)
      await store.set('collections', collectionFromStore)
      await store.save()
      return collectionFromStore
    }

    updateCollections()
  }, [tagToRemove, tagToAdd])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()])
        setTagToAdd(inputValue.trim())
      }
      setInputValue("")
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
    setTagToRemove(tagToRemove)
  }

  return (

    <div className="flex flex-wrap items-center gap-1 border rounded-lg p-2 w-[90%] text-xs">
      {tags.map((tag) => {
        const Icon = getIconForString(tag)
        return (
          <div
            key={tag}
            className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
          >
            <Icon size={14} />
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive ml-1"
            >
              <X size={12} />
            </button>
          </div>
        )
      })}

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bg-transparent outline-none flex-1 min-w-[80px] p-1"
      />
    </div>
  )
}

export { TagInput, getIconForString }
