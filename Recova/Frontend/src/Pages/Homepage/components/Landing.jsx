
'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'




const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
]

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className=" dark:bg-[#212121] z-40 ">
     

      <div className="relative isolate px-6  lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 transform-gpu overflow-hidden blur-3xl sm:-top-80 "
        >
<div
  style={{
    WebkitClipPath:
      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
    clipPath:
      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
  }}
  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
/>
</div>
        <div className="mx-auto h-auto  max-w-2xl py-32 sm:py-36">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        
          </div>
          <div className="text-center ">
            <h1 className="text-5xl font-semibold tracking-tighter font-cabin  text-balance text-secondary dark:text-gray-100 sm:text-7xl">
              Catch Fraudsters, Stay Secure.
            </h1>
            <p className="mt-8 text-[13px] leading-snug ml-2  dark:text-gray-400 font-medium font-poppinsMedium text-gray-600  sm:text-[16px] text-wrap">
            Protect Your Transactions, Stop Fraud in Its Tracks!
            </p>
            <div className="mt-20 flex  items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-primary px-5 py-2.5  text-sm font-poppinsMedium text-white shadow-xs hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 ease-in-out"
              >
                Get started
              </a>
              <a href="#" className="text-sm/6 font-poppinsMedium dark:text-white text-gray-900 rounded-[5px] p-[5px] px-4 outline-none focus:outline-none hover:outline hover:outline-[1px] hover:outline-primary transition-all duration-200">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  )
}
