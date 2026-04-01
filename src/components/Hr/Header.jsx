import React from 'react'
import Image from 'next/image'
import LiveClock from "@/components/LiveClock";
import Link from 'next/link';


export default function Header({logout, user}) {
  return (
    <>
        <div className="flex-none md:flex gap-5 font-bold text-xl text-gray-900">
          <Image
            src="/logo.png"
            alt="Lacson & Lacson Logo"
            width={200}
            height={60}
            style={{ objectFit: "contain" }}
            priority
          />
          <div className="my-auto w-full">
            <div className="w-full text-center md:text-right">
              <p>
                HR <span className="text-blue-900">Client Care Portal</span>
              </p>
              <p className="text-sm text-gray-700">
                <LiveClock />
              </p>
              <div className="flex justify-end">
                <div className="relative group">
                  <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                    <span className="capitalize">
                      {user?.last_name + ", " + user?.first_name}
                    </span>
                    <span className="ml-1">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-100 hidden group-focus-within:block z-50">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-normal"
                    >
                      Logout
                    </button>
                    <Link
                      href={"/hr/change-password"}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-normal"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-2 mb-3 border-b-4 shadow border-blue-900 rounded-lg" />

    </>
  )
}
