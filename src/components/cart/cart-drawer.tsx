'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartContext } from '@/context/cart-context'
import { CartItemCard } from './cart-item-card'
import { CartSummary } from './cart-summary'
import { EmptyCartState } from './empty-cart-state'
import { Button } from '@/components/ui/button'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state } = useCartContext()

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-gray-600" />
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                          Shopping Cart
                        </Dialog.Title>
                        {state.items.length > 0 && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({state.totalItems} {state.totalItems === 1 ? 'item' : 'items'})
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="rounded-md bg-white p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close cart</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      {state.items.length === 0 ? (
                        <EmptyCartState onContinueShopping={onClose} />
                      ) : (
                        <>
                          {/* Cart Items */}
                          <div className="px-4 py-6 sm:px-6">
                            <div className="space-y-6">
                              {state.items.map((item) => (
                                <CartItemCard key={`${item.productId}-${item.size}-${item.color}`} item={item} />
                              ))}
                            </div>
                          </div>

                          {/* Cart Summary */}
                          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <CartSummary />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Footer Actions */}
                    {state.items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
                        <div className="space-y-3">
                          <Button
                            className="w-full bg-[#e53e3e] hover:bg-[#c53030] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            onClick={() => {
                              // TODO: Navigate to checkout
                              // eslint-disable-next-line no-console
                              console.log('Navigate to checkout')
                              onClose()
                            }}
                          >
                            Proceed to Checkout
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            onClick={onClose}
                          >
                            Continue Shopping
                          </Button>
                        </div>
                        <p className="mt-4 text-xs text-gray-500 text-center">
                          Free shipping on orders over $75
                        </p>
                      </div>
                    )}

                    {/* Loading/Error States */}
                    {state.isLoading && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e53e3e]"></div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 