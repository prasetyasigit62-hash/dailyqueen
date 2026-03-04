/* eslint-disable react/jsx-no-comment-textnodes */

'use client';

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, memo } from 'react';

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    closeModal: () => void;
    title: string;
    className: string;
    // eslint-disable-next-line react/require-default-props
    showClose?: boolean;
}

function Modal({ children, isOpen, closeModal, title, className, showClose }: ModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`${className} transform overflow-hidden text-left align-middle shadow-xl transition-all`}>
                                <Dialog.Title
                                    as="h3"
                                    className={`text-lg leading-6 text-gray-900 flex justify-between font-semibold ${showClose ? 'p-3' : 'p-0'}`}
                                >
                                    {showClose && (
                                        <>
                                            {title}
                                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                                            <span onClick={closeModal} className="cursor-pointer">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </span>
                                        </>
                                    )}
                                </Dialog.Title>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default memo(Modal);
