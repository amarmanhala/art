import { Link } from "react-router-dom"

const footerLinks = [
  ["About Us", "/about"],
  ["Contact", "/contact"],
  ["Order Status", "/"],
  ["Returns", "/returns"],
  ["Terms of Use", "/terms"],
  ["Privacy Policy", "/privacy"],
]

export function Footer() {
  return (
    <footer className="border-t px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {footerLinks.map(([label, href]) => (
            <Link key={label} className="text-sm font-medium" to={href}>
              {label}
            </Link>
          ))}
        </div>

        <Link
          to="/"
          aria-label="Instagram"
          className="inline-flex items-center gap-3 text-sm font-medium"
        >
          <span>We love Instagram</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-5 fill-current"
          >
            <path d="M 8 3 C 5.239 3 3 5.239 3 8 L 3 16 C 3 18.761 5.239 21 8 21 L 16 21 C 18.761 21 21 18.761 21 16 L 21 8 C 21 5.239 18.761 3 16 3 L 8 3 z M 18 5 C 18.552 5 19 5.448 19 6 C 19 6.552 18.552 7 18 7 C 17.448 7 17 6.552 17 6 C 17 5.448 17.448 5 18 5 z M 12 7 C 14.761 7 17 9.239 17 12 C 17 14.761 14.761 17 12 17 C 9.239 17 7 14.761 7 12 C 7 9.239 9.239 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z" />
          </svg>
        </Link>
      </div>
    </footer>
  )
}
