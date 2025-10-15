import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import { Home, Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="flex items-center bg-zinc-800 shadow-lg p-4 text-zinc-100">
        <button
          onClick={() => setIsOpen(true)}
          className="hover:bg-zinc-700 p-2 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 font-semibold text-xl">
          <Link to="/">
            <img
              src="/tanstack-word-logo-white.svg"
              alt="TanStack Logo"
              className="h-10"
            />
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-gray-700 border-b">
          <h2 className="font-bold text-xl">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-800 p-2 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:bg-gray-800 mb-2 p-3 rounded-lg transition-colors"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {/* Demo Links Start */}

          {/* Demo Links End */}
        </nav>
      </aside>
    </>
  )
}
