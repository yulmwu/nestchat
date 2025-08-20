'use client'

import { Search, Plus, Menu, LogIn } from 'lucide-react'
import { useAuth } from '@/app/context/AuthContext'
import { useState } from 'react'
import AuthModal from '../Auth/AuthModal'
import LoginForm from '../Auth/LoginForm'
import RegisterForm from '../Auth/RegisterForm'

import UserMenu from './UserMenu'

interface HeaderProps {
    onMenuClick?: () => void
    searchQuery?: string
}

export function Header(props: HeaderProps) {
    const { user, logout, loading } = useAuth()
    const [modal, setModal] = useState<'login' | 'register' | null>(null)
    const [search, setSearch] = useState(props.searchQuery ?? '')

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && search.trim().length > 0) {
            window.location.href = `/search?query=${encodeURIComponent(search.trim())}`
        }
    }

    return (
        <>
            <header className='bg-white border-b border-gray-200 sticky top-0 z-50 w-full px-0 lg:px-4'>
                <div className='flex items-center justify-between px-2 md:px-4 py-2 gap-2'>
                    <div className='flex items-center gap-2 min-w-0'>
                        {props.onMenuClick && (
                            <button
                                className='p-2 rounded-full hover:bg-gray-100 md:hidden flex items-center justify-center'
                                aria-label='Open menu'
                                onClick={props.onMenuClick}
                            >
                                <Menu className='w-6 h-6 text-gray-700' />
                            </button>
                        )}

                        <div className='hidden md:flex items-center space-x-2'>
                            <a href='/' className='flex items-center space-x-2'>
                                <div className='w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <span className='text-white font-bold text-sm'>7</span>
                                </div>
                                <span className='text-lg md:text-xl font-bold text-slate-600 truncate'>0725</span>
                            </a>
                        </div>
                    </div>

                    <div className='flex-1 max-w-xs md:max-w-2xl mx-2 md:mx-8'>
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                            <input
                                placeholder='검색...'
                                className='pl-10 bg-gray-100 border border-gray-200 rounded-full w-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button className='w-9 h-9 flex-shrink-0 bg-slate-600 hover:bg-slate-700 text-white rounded-full flex items-center justify-center'>
                            <Plus className='w-4 h-4' />
                        </button>
                        {loading ? null : user ? (
                            <UserMenu user={user} onLogout={logout} />
                        ) : (
                            <>
                                <button
                                    className='w-9 md:w-auto h-9 flex-shrink-0 flex items-center justify-center gap-1 md:px-3 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700'
                                    onClick={() => setModal('login')}
                                    aria-label='로그인'
                                >
                                    <LogIn className='w-4 h-4' />
                                    <span className='hidden md:inline ml-1.5'>로그인/회원가입</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <AuthModal visible={modal === 'login'} onHide={() => setModal(null)}>
                <LoginForm onSuccess={() => setModal(null)} />
                <div className='flex justify-center mt-4 text-sm text-gray-500'>
                    <button className='hover:underline text-slate-600' onClick={() => setModal('register')}>
                        회원가입
                    </button>
                </div>
            </AuthModal>
            <AuthModal visible={modal === 'register'} onHide={() => setModal(null)}>
                <RegisterForm onSuccess={() => setModal('login')} />
                <div className='flex justify-center mt-4 text-sm text-gray-500'>
                    <button className='hover:underline text-slate-600' onClick={() => setModal('login')}>
                        로그인
                    </button>
                </div>
            </AuthModal>
        </>
    )
}
