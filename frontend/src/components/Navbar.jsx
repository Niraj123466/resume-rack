"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { signOut } from "firebase/auth"
import { auth } from "../services/firebase" // your firebase config
import { Star } from "lucide-react"

const Navbar = () => {
  const { credits } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "wireframe")
  const { user } = useAuth()

  const handleToggle = (e) => {
    const newTheme = e.target.checked ? "night" : "wireframe"
    setTheme(newTheme)
  }

  useEffect(() => {
    localStorage.setItem("theme", theme)
    document.querySelector("html").setAttribute("data-theme", theme)
  }, [theme])

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 md:px-6 py-3 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="navbar-start">
        <div className="dropdown">
          <button className="btn btn-ghost lg:hidden rounded-lg hover:bg-base-200 transition-colors" tabIndex={0}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-lg mt-3 w-52 p-2 shadow-lg border border-base-200 z-50"
          >
            <li>
              <button
                onClick={() => handleNavigation("/")}
                className="font-medium py-2 hover:bg-base-200 rounded-md transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/upload")}
                className="font-medium py-2 hover:bg-base-200 rounded-md transition-colors"
              >
                Upload
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/about")}
                className="font-medium py-2 hover:bg-base-200 rounded-md transition-colors"
              >
                About
              </button>
            </li>
            {!user ? (
              <>
                <li>
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="font-medium py-2 hover:bg-base-200 rounded-md transition-colors"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/signup")}
                    className="font-medium py-2 hover:bg-base-200 rounded-md transition-colors"
                  >
                    Signup
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="font-medium py-2 hover:bg-base-200 rounded-md transition-colors"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
        <button
          className="btn btn-ghost text-xl font-bold tracking-tight hover:bg-base-200 transition-colors"
          onClick={() => handleNavigation("/")}
        >
          <span className="text-primary">Resume</span>Ranker
        </button>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <button
              onClick={() => handleNavigation("/")}
              className="px-4 py-2 rounded-md font-medium hover:bg-base-200 transition-colors"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/upload")}
              className="px-4 py-2 rounded-md font-medium hover:bg-base-200 transition-colors"
            >
              Upload
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/about")}
              className="px-4 py-2 rounded-md font-medium hover:bg-base-200 transition-colors"
            >
              About
            </button>
          </li>
        </ul>
      </div>

      <div className="navbar-end flex items-center gap-3 md:gap-4">
        {/* Show Auth Buttons */}
        {!user ? (
          <>
            <button
              onClick={() => handleNavigation("/login")}
              className="btn btn-sm btn-outline rounded-md hover:bg-base-200 transition-colors hidden sm:flex"
            >
              Login
            </button>
            <button
              onClick={() => handleNavigation("/signup")}
              className="btn btn-sm btn-primary rounded-md hover:opacity-90 transition-colors"
            >
              Signup
            </button>
          </>
        ) : (
          <>
            <span className="text-sm hidden md:block font-medium">Hi, {user.email}</span>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-error text-white rounded-md hover:opacity-90 transition-colors"
            >
              Logout
            </button>
          </>
        )}

        <div className="flex items-center gap-3 border-l pl-3 border-base-300">
          <div className="flex items-center gap-1.5 bg-base-200 px-2.5 py-1.5 rounded-full">
            <Star className="text-yellow-500 h-4 w-4" />
            <span className="text-sm font-semibold">{credits}</span>
          </div>

          <label className="swap swap-rotate">
            <input type="checkbox" onChange={handleToggle} checked={theme === "night"} className="hidden" />
            {/* Sun Icon */}
            <svg
              className="swap-on h-8 w-8 fill-current text-yellow-500 hover:text-yellow-400 transition-colors cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            {/* Moon Icon */}
            <svg
              className="swap-off h-8 w-8 fill-current text-slate-700 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
