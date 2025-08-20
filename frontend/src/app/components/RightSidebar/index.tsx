const RightSidebar = () => {
    return (
        <aside className='hidden lg:block md:w-80 bg-white border-l border-gray-200 sticky top-14 h-[calc(100vh-4rem)] overflow-y-auto'>
            <section className='p-4'>
                <div className='flex items-center mb-4'>
                    <span className='text-lg font-bold text-slate-700'>테스트</span>
                </div>
            </section>
        </aside>
    )
}

export { RightSidebar }
