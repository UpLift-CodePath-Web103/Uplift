import React from 'react'

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <div>
        <h1>This is the main dashboard</h1>
        <div>
                <h3>Create Post</h3>
                <h3>Share Mood</h3>
                <ul>
                    <li>Dashboard</li>
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
