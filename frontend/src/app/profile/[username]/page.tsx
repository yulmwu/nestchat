'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserByUsername, UserResponse } from '@/api/users'
import { PageLayout } from '@/app/components/PageLayout'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { followUser, unfollowUser } from '@/api/subscription'
import UserCard from '@/app/profile/UserCard'
import { useState } from 'react'
import Link from 'next/link'
import { formatDate } from '@/utils/dateFormatter'
import Pagination from '@/app/components/Pagination'

const LIMIT_OPTIONS = [5, 10, 15, 20]
const MAX_PAGE_BUTTONS = 5

const UserProfilePage = () => {
    const params = useParams()
    const username = params?.username as string
    const { user: currentUser } = useAuth()

    const queryClient = useQueryClient()

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery<UserResponse>({
        queryKey: ['userProfile', username],
        queryFn: () => getUserByUsername(username),
        enabled: !!username,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    const followMutation = useMutation({
        mutationFn: () => followUser(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', username] })
        },
    })

    const unfollowMutation = useMutation({
        mutationFn: () => unfollowUser(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', username] })
        },
    })

    return (
        <PageLayout currentItem='profile'>
            <section className='w-full flex flex-col items-center p-5'>
                <UserCard
                    user={user}
                    mode={currentUser?.username === username ? 'self' : 'other'}
                    loading={isLoading}
                    onFollow={() => followMutation.mutate()}
                    onUnfollow={() => unfollowMutation.mutate()}
                />
            </section>
        </PageLayout>
    )
}

export default UserProfilePage
