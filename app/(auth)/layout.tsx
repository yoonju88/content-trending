import React from 'react'

export default function layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="max-w-screen-sm mx-auto p-20">
            {children}
        </div>
    )
}