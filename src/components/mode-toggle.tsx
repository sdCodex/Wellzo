"use client"


import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"


export function ModeToggle() {
  const { theme,setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent rendering until theme is available
  if (!mounted) return null
  function handleClick()
  {
    if(theme==="dark")
    {
        setTheme("light");
    }
    else {
        setTheme("dark");
    }
  }
  return (
    <>
    <Button variant={"outline"} onClick={handleClick} size={"icon"}>
        {
            theme==="dark"? (
                <Sun />
            ):(
                <Moon/>
            )
        }
    </Button>
    </>
  )
}
