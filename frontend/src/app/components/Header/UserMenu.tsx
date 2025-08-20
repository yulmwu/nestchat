import { LogOut } from 'lucide-react'
import React, { useRef, useEffect, useState } from 'react'

interface UserMenuProps {
    user: { nickname?: string; username: string }
    onLogout: () => void
    onProfile?: () => void
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onProfile }) => {
    const [open, setOpen] = useState(false)
    const [visible, setVisible] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open) setVisible(true)
    }, [open])

    useEffect(() => {
        if (!open) return
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    return (
        <div className='relative' ref={menuRef}>
            <button
                className='w-9 h-9 min-w-9 min-h-9 flex-none rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'
                onClick={() => setOpen((v) => !v)}
                aria-label='유저 메뉴 열기'
            >
                <span className='text-gray-600 font-medium text-sm leading-none'>
                    {user.nickname ? user.nickname[0].toUpperCase() : user.username[0].toUpperCase()}
                </span>
            </button>

            {visible && (
                <div
                    className={`absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col py-2 transition-all duration-150
                        ${open ? 'animate-fadeIn' : 'animate-fadeOut'}`}
                    onAnimationEnd={() => {
                        if (!open) setVisible(false)
                    }}
                >
                    <button
                        className='text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm'
                        onClick={() => {
                            setOpen(false)
                            if (onProfile) onProfile()
                            else window.location.href = '/profile'
                        }}
                    >
                        내 정보 보기
                    </button>
                    <div className='border-t my-1' />
                    <button
                        className='text-left px-4 py-2 hover:bg-gray-100 text-red-500 text-sm flex items-center gap-2'
                        onClick={() => {
                            setOpen(false)
                            onLogout()
                        }}
                    >
                        <LogOut className='w-4 h-4' /> 로그아웃
                    </button>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.15s ease forwards;
                }
                .animate-fadeOut {
                    animation: fadeOut 0.15s ease forwards;
                }
            `}</style>
        </div>
    )
}

export default UserMenu
