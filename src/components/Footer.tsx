import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer id='main-footer' className="bg-[#f8fbff] shadow-sm fixed bottom-0 left-0 w-full dark:bg-gray-800 opacity-55">
        <div className="w-full mx-auto max-w-screen-xl p-4 flex items-center justify-center">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            Coded by {" "}
            <Link href="https://github.com/LuisCorreaDv" className="hover:underline" target='_blank'>
               Luis Correa {" "}
            </Link>{" "}
            . All Rights Reserved.
          </span>
        </div>
    </footer>
  )
}

export default Footer