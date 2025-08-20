'use client'

import { useState } from 'react'
import { CalendarArrowUp, ChartNoAxesCombined } from 'lucide-react'
import { SearchBar, SearchValues } from './Search'

type Tab = 'popular' | 'latest'

const MainPage = () => {
    const handleSearch = (values: SearchValues) => {
        const { query, author } = values
        const searchParams = new URLSearchParams()

        if (query) searchParams.set('query', query)
        if (author) searchParams.set('author', author)

        window.location.href = `/search?${searchParams.toString()}`
    }

    return (
        <section className='w-full flex flex-col items-center mt-10 mb-10 p-5'>
            <SearchBar onSearch={handleSearch} />

            <div className='relative w-full max-w-6xl mb-10'>
                <div className='flex items-center mb-10 ml-10 gap-3'></div>
            </div>
        </section>
    )
}

export { MainPage }
