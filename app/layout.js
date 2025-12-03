import './globals.css'

export const metadata = {
  title: 'Lineup - Hockey Attendance',
  description: 'Manage your hockey team attendance',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
