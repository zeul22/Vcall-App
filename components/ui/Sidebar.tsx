import { sidebarLinks } from '@/constants'
import { link } from 'fs';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
    const pathname=usePathname();
  return (
    <section className='sticky left-0 top-0
     flex h-screen w-fit flex-col
      justify-between bg-dark-1
      max-sm:hidden p-6 pt-28 lg:w-[264px]
      '>
        <div className='flex flex-col flex-1 gap-6'>
            {sidebarLinks.map((link)=>(
                const isActive===pathname === link.route || pathname.startsWith(link.route);
                return (
                    <Link href={link.route} key={link.label}>
                    
                    </Link>
                )
            ))}
        </div>

    </section>
  )
}

export default Sidebar