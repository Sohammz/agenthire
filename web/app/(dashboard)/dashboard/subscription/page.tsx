'use client';

import React from 'react';
import Nav from '../../../../components/Nav';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function SubscriptionsPage() {
  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '₹0 /mo',
      features: [
        '2 mock interviews per week',
        'Basic STAR feedback',
        'Community access',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '₹499 /mo',
      features: [
        'Unlimited mock interviews',
        'Advanced STAR coaching',
        'Basic analytics',
        'Priority mock scheduling',
      ],
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '₹999 /mo',
      features: [
        'Unlimited everything',
        'Full analytics & progress tracking',
        'Behavioral + Technical coaching',
        'Dedicated AI mentor & updates',
      ],
    },
  ];

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1
          className="text-3xl font-extrabold text-center mb-10"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Subscription Plans
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 180, damping: 15 }}
              className="rounded-2xl p-8 bg-gradient-to-br from-white/90 to-white/60 
                         dark:from-gray-900/80 dark:to-gray-800/60 
                         shadow-lg border border-transparent 
                         hover:border-purple-400/60 hover:shadow-purple-300/40
                         flex flex-col justify-between text-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {plan.name}
                </h2>
                <p className="text-3xl font-bold text-purple-600 mb-4">
                  {plan.price}
                </p>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle size={14} className="text-purple-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                className={`px-6 py-3 rounded-lg text-sm font-medium text-white 
                            shadow-md bg-purple-600 hover:bg-purple-700 transition`}
              >
                {plan.id === 'free' ? 'Current Plan' : 'Choose Plan'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
}
