'use client'
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SignOutButton, useUser } from '@clerk/nextjs';

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
];

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="relative z-40">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold">
            <Link href="/">TaskMaster-AI</Link>
          </div>
          <div className="hidden lg:flex space-x-4">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-300 hover:text-white">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex">
            {user ? (
              <SignOutButton className="text-gray-300 hover:text-white">Sign out</SignOutButton>
            ) : (
              <Link href="/sign-in" className="text-gray-300 hover:text-white">
                Log in
              </Link>
            )}
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white"
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
              <Link href="/" className="font-bold">
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
            <div className="mt-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="block py-2">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </Dialog>
      </nav>
    </div>
  );
};

export default NavBar;
