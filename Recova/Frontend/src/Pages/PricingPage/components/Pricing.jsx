import { CheckIcon } from '@heroicons/react/20/solid'
import { IoIosArrowRoundBack } from "react-icons/io";
import { loadStripe } from '@stripe/stripe-js';
import axios from '../../../config/axios.js';
import React from 'react';
import Modal from '../../../components/Modal.jsx';
import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import stripepic from '../../../assets/stripe-logo.png'
import payfastpic from '../../../assets/payfast.png'

const tiers = [
  {
    name: 'Hobby',
    id: 'tier-hobby',
    href: '#',
    priceMonthly: '$29',
    description: "The perfect plan if you're just getting started with our product.",
    features: ['25 products', 'Up to 10,000 subscribers', 'Advanced analytics', '24-hour support response time'],
    featured: false,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: '$99',
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      'Dedicated support representative',
      'Marketing automations',
      'Custom integrations',
    ],
    featured: true,
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const stripePromise = loadStripe('pk_test_51RAHHuPEbCDf85gwAZm91b8i5E4YMW3HK0FbkTL5dcocO672uYNrioe4FH76NtNBRTVczjlEldGzZWEsiEjhLfZf00o0AjFSAq');

const handleClick = async () => {
  try {
    // Make a POST request to your backend to create a checkout session
    const res = await axios.post('http://localhost:3000/create-checkout-session');
    console.log("Response from backend:", res.data); // Debugging
    
    // Extract the session URL from the response
    const { sessionId } = res.data;

    // Redirect the user to the Stripe Checkout page
    const stripe = await stripePromise;
    stripe.redirectToCheckout({ sessionId })
    
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};

export default function Pricing() {
   const [logout, setlogout] = useState(false)
    const [opendialog, setopendialog] = useState(true)

    const openmodal = () => {
      setlogout(true);
    }
    const closeModal = () => {
      setlogout(false);
    };
    
  return (
    
    <div className="relative isolate bg-white px-6   sm:py-12 lg:px-8">
        <a href="/" className=" w-[3vw]">
                     
                <IoIosArrowRoundBack className="text-[2vw]"/>
                      </a>
      <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
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
      <div className="mx-auto  max-w-4xl text-center">
        <p className=" textr   text-[1.5vw] font-poppinsSemiBold tracking-tight text-balance text-gray-900 sm:text-[3.7vw]">
          Choose the right plan for you !
        </p>
      </div>
      <p className="mx-auto mt-2 font-semibold font-poppinsLight max-w-2xl text-center text-lg text-gray-600 sm:text-[15px]">
        Choose an affordable plan that’s packed with the best features. 
      </p>
      <div className="mx-auto mt- grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-10 sm:gap-y-0 lg:max-w-3xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                  : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10',
            )}
          >
            <h3
              id={tier.id}
              className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base/7 font-semibold')}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-semibold tracking-tight',
                )}
              >
                {tier.priceMonthly}
              </span>
              <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base')}>/month</span>
            </p>
            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7')}>
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-8 space-y-3 text-sm/6 sm:mt-10',
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none')}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-indigo-500 text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-indigo-500'
                  : 'text-indigo-600 ring-1 ring-indigo-200 ring-inset hover:ring-indigo-300 focus-visible:outline-indigo-600',
                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10',
              )}
            >
              <button onClick={openmodal}>
              Get started today
              </button>
                     {logout && <Modal>
                    <Dialog open={opendialog} onClose={closeModal} className="relative z-10">
                  <DialogBackdrop
                      transition
                      className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />
              
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                          transition
                          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                             
                              <div className=" ml-14 text-center sm:mt-0 ">
                                <DialogTitle as="h3" className="text-2xl tracking-tight flex items-center justify-center text-gray-900">
                                  <i>Pay with</i>
                                </DialogTitle>
                            

<div className="mt-7  flex items-center justify-center gap-10">
  <button className=" w-40 h-14  flex items-center justify-center overflow-hidden" onClick={handleClick}>
    <img src={stripepic} className=" h-16 transform hover:scale-110 transition-transform duration-100 ease-in-out object-contain" alt="stripe" />
  </button>

  <button className="w-40 h-10 p-2 rounded-md flex items-center justify-center">
    <img src={payfastpic} className="w-full transform hover:scale-110 transition-transform duration-100 ease-in-out object-contain mr-10" alt="payfast" />
  </button>
</div>

                              </div>
                            </div>
                          </div>
                      
                        </DialogPanel>
                      </div>
                    </div>
                  </Dialog>
              
                        </Modal>}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
