'use client';
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SignOutButton, useUser } from '@clerk/nextjs';
import NotificationBell from './NotificationBell';

const navigation = [
  { name: 'Features', href: '#feature-grid' }, // Update href to point to the FeatureGrid component
];

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="relative z-40">
      <nav className="w-full mx-auto p-4 shadow-sm bg-[#7A79EA] backdrop-blur-lg">
        <div className="flex justify-between items-center px-4">
          <div className="text-white font-bold text-xl">
            <Link href="/">DevLiftoff</Link>
          </div>
          <div className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-white hover:text-yellow-300 transition duration-300 ease-in-out hover:underline">
                {item.name}
              </Link>
            ))}
            {user && (
              <>
                <Link href="/projects" className="text-white hover:text-yellow-300 transition duration-300 ease-in-out hover:underline">
                  Projects
                </Link>
                <Link href="/user-profile" className="text-white hover:text-yellow-300 transition duration-300 ease-in-out hover:underline">
                  Profile
                </Link>
              </>
            )}
          </div>
          <div className="hidden lg:flex space-x-4">
            {user && <NotificationBell />}
            {user ? (
              <SignOutButton className="text-white hover:text-yellow-300 transition duration-300 ease-in-out hover:underline">Sign out</SignOutButton>
            ) : (
              <Link href="/sign-in" className="border-white/6 px-4 py-2 backdrop-blur sm:rounded-lg sm:border bg-white/5 text-white text-xs transition-all duration-200 hover:bg-white/10 hover:scale-105">
                Log in
              </Link>
            )}
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              className="text-white hover:text-yellow-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white p-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-bold text-xl text-gray-800">
                TaskMaster-AI
              </Link>
              <button
                type="button"
                className="text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="block py-2 text-gray-800 hover:text-yellow-300 transition duration-300 ease-in-out hover:underline">
                  {item.name}
                </Link>
              ))}
              {user && (
                <>
                  <Link href="/projects" className="block py-2 text-gray-800 hover:text-yellow-300 transition duration-300 ease-in-out hover:underline">
                    Projects
                  </Link>
                  <Link href="/user-profile" className="block py-2 text-gray-800 hover:text-yellow-300 transition duration-300 ease-in-out hover:underline">
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>
        </Dialog>
      </nav>
    </div>
  );
};

export default NavBar;
