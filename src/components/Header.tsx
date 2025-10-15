import { Link } from '@tanstack/react-router'

import { ExternalLink } from 'lucide-react'

export default function Header() {
  return (
    <>
      <nav className="right-10 bottom-10 fixed bg-yellow-500">
        <Link
          to="/ticker"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:bg-zinc-800 p-3 rounded-lg transition-colors"
          activeProps={{
            className:
              'flex items-center gap-3 p-3 rounded-lg bg-teal-600 hover:bg-teal-700 transition-colors mb-2',
          }}
        >
          <ExternalLink size={20} />
          <span className="font-medium">Ticker</span>
        </Link>
      </nav>
    </>
  )
}
