import localFont from 'next/font/local'
import { AuthProvider } from './context/AuthContext'
import { SidebarProvider } from './context/SidebarContext'
import { ReactQueryProvider } from './ReactQueryProvider'

import './globals.css'

const pretendard = localFont({
    src: '../../public/fonts/PretendardVariable.woff2',
    display: 'swap',
    weight: '300',
    variable: '--font-pretendard',
})

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <html lang='en' className={`${pretendard.variable}`}>
        <body className={pretendard.className}>
            <ReactQueryProvider>
                <AuthProvider>
                    <SidebarProvider>{children}</SidebarProvider>
                </AuthProvider>
            </ReactQueryProvider>
        </body>
    </html>
)

export default RootLayout
