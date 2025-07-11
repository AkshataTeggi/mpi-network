// "use client"

// import { useTheme } from "next-themes"
// import { Moon, Sun } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useEffect, useState } from "react"

// export function ThemeToggle() {
//   const { setTheme, resolvedTheme } = useTheme()
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) return null

//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
//       className="bg-red-200 dark:bg-red-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
//     >
//       {resolvedTheme === "dark" ? (
//         <Sun className="h-4 w-4" />
//       ) : (
//         <Moon className="h-4 w-4" />
//       )}
//     </Button>
//   )
// }




"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="bg-green-200 dark:bg-green-700 text-black dark:text-white hover:bg-green-300 dark:hover:bg-green-600 rounded-md"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
