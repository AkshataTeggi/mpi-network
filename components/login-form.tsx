


// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import Image from "next/image"
// import { LogIn, Loader2 } from "lucide-react"
// import { API_BASE_URL } from "@/lib/constants"
// import {jwtDecode} from 'jwt-decode';



// interface LoginFormProps {
//   onLogin: (userData: any, permissions: string[]) => void
// }

// const LOGO_URL =
//   "/logo.svg"

// export default function LoginForm({ onLogin }: LoginFormProps) {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)


// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!email || !password) {
//     setError("Please enter both email and password");
//     return;
//   }

//   setIsLoading(true);
//   setError("");

//   try {
//     const response = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Login failed");
//     }

//     if (data.accessToken)  localStorage.setItem("access_token",  data.accessToken);
//     if (data.refreshToken) localStorage.setItem("refresh_token", data.refreshToken);

//     let role         : string        = data.role ?? "";
//     let permissions  : string[]      =
//       (data.rolePermissions ?? []).map((p: { name: string }) => p.name) ?? [];

//     /* Fallback if backend ever omits rolePermissions array */
//     if (!role || permissions.length === 0) {
//       try {
//         const decoded = jwtDecode<{ role?: string; permissions?: string[] }>(
//           data.accessToken
//         );
//         role        ||= decoded.role ?? "";
//         permissions ||= decoded.permissions ?? [];
//       } catch {/* ignore decode errors */}
//     }

//    role = (role || "").trim().toLowerCase();
// permissions = Array.isArray(permissions)
//   ? permissions.map(p => (p || "").trim().toLowerCase())
//   : [];


//     localStorage.setItem("role", role);
//     localStorage.setItem("permissions", JSON.stringify(permissions));
//     localStorage.setItem("username", data.username ?? "");

//     onLogin(data, permissions);
//   } catch (err) {
//     console.error("Login error:", err);
//     setError(err instanceof Error ? err.message : "An error occurred during login");
//   } finally {
//     setIsLoading(false);
//   }
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
//       <div className="w-full max-w-sm">
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
//           <div className="flex justify-center mb-4">
//             <Image
//               src={LOGO_URL}
//               alt="Network PCB Logo"
//               width={180}
//               height={100}
//               className="h-auto"
//               priority
//             />
//           </div>
//           <h2 className="text-lg font-bold text-center text-[hsl(var(--primary))] mb-4 -mt-10">
//             Manufacturing Process
//           </h2>

//           {error && (
//             <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-2 rounded-md mb-3 text-xs">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-3">
//             <div className="space-y-1">
//               <Label htmlFor="email" className="text-sm">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 className="h-8 text-sm"
//                 disabled={isLoading}
//               />
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="password" className="text-sm">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 className="h-8 text-sm"
//                 disabled={isLoading}
//               />
//             </div>
//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white flex items-center justify-center gap-1.5"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                   <span>Signing In...</span>
//                 </>
//               ) : (
//                 <>
//                   <LogIn className="h-3.5 w-3.5" />
//                   <span>Sign In</span>
//                 </>
//               )}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }













"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { LogIn, Loader2 } from "lucide-react"
import { useAuth } from "./context/AuthContext"

const LOGO_URL = "/logo.svg"

export default function LoginForm() {
  const { login }   = useAuth()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [err, setErr]           = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setErr("Both fields required"); return }
    setLoading(true); setErr("")
    try {
      await login(email, password)
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border">
          <div className="flex justify-center mb-4">
            <Image src={LOGO_URL} alt="logo" width={180} height={100} priority />
          </div>
          <h2 className="text-lg font-bold text-center text-[hsl(var(--primary))] mb-4 -mt-10">
            Manufacturing Process
          </h2>

          {err && <p className="text-red-600 text-sm mb-3">{err}</p>}

          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="em">Email</Label>
              <Input id="em" value={email} onChange={e=>setEmail(e.target.value)} disabled={loading} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" value={password}
                     onChange={e=>setPassword(e.target.value)} disabled={loading} />
            </div>
            <Button type="submit" disabled={loading} className="w-full flex gap-2 justify-center">
              {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <LogIn className="h-4 w-4"/>}
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}



