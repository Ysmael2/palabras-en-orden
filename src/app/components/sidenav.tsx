'use client'

import NavLinks from '@/app/components/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useAuthStore } from '@/app/stores/authStore';
import { useRouter } from 'next/navigation';


export default function SideNav() {

  const router = useRouter()

  const logout = useAuthStore((state) => state.logout);

  const navLogin = ()=>{
    logout()
    router.push('/pages/auth/login')
  }

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <div className="w-32 flex text-white justify-center md:w-40">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={400}
                      height={300}
                      className="rounded-full justify-self-center"
                    />
        </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
          <button 
          onClick={
            navLogin
          }
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Cerrar Sesion</div>
          </button>
      </div>
    </div>
  );
}
