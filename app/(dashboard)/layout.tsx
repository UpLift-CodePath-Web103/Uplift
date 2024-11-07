import Link from 'next/link'
import React from 'react'

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <div>
        <h1>This is the main dashboard</h1>
        <div>
        <Link href = '/dashboard/new-entries'><h3>Create Jounral Entry</h3></Link>
                <h3>Share Mood</h3>
                <ul>
                <li><Link href = '/dashboard'>Dashboard</Link></li>
                    <li>Breathing Excersises</li>
                    <li>Motivation</li>
                    <li>History</li>
                </ul>
        </div>
        {children}
    </div>
  )
}

export default layout
