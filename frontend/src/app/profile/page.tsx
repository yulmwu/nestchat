'use client'

import { PageLayout } from '../components/PageLayout'
import UserCard from './UserCard'

const ProfilePage = () => {
    return (
        <PageLayout currentItem='profile'>
            <section className='w-full flex flex-col items-center p-5'>
                <UserCard />
            </section>
        </PageLayout>
    )
}

export default ProfilePage
