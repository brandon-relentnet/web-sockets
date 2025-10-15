import { Link } from '@tanstack/react-router'

import { ExternalLink } from 'lucide-react'

export default function FAB() {
  return (
    <>
      <nav className="right-10 bottom-10 z-50 fixed">
        <Link
          to="/ticker"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <ExternalLink size={20} />
          <span className="font-medium">Ticker</span>
        </Link>
      </nav>
    </>
  )
}
