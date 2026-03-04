'use client';

import { Spinner } from 'flowbite-react';
import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { toast, ToastContainer } from 'react-toastify';
import styles from '@/styles/AboutUs.module.css';
import 'react-toastify/dist/ReactToastify.css';

type FormProps = {
    apiUrl: string | undefined;
    mallId: string | undefined;
    color: string;
};
export default function ContactForm(props: FormProps) {
    const { apiUrl, mallId, color } = props;
    const [attach, setAttach] = React.useState('Attach Files');
    const [upload, setUpload] = React.useState(false);

    const form = React.useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentForm = form.current;
        if (currentForm == null) return;
        const data = new FormData(currentForm);
        if (data.getAll('sendTo[]').length === 0) {
            toast.error('Select one of Event Promo, CS or Leasing, Please!');
            return;
        }
        try {
            setUpload(true);
            const res = await fetch(`${apiUrl}/api/guest/sendEmail`, {
                method: 'POST',
                body: data,
            });
            // handle the error
            if (!res.ok) throw new Error(await res.text());
            setUpload(false);
            toast.success('Your message has been sent!');
        } catch (e: any) {
            // Handle errors here
            // eslint-disable-next-line no-console
            console.error(e);
            toast.error('Sorry, we have problem on our side!');
        }
    };

    const handleReset = () => {
        const currentForm = form.current;
        if (currentForm == null) return;
        currentForm.reset();
        setUpload(false);
        setAttach('Attach Files');
    };

    return (
        <section id="contact-us" className="md:p-8">
            <ToastContainer />
            <div className="md:px-48">
                <div className="md:rounded-tr-[2.5rem] md:rounded-bl-[2.5rem] py-5 px-5 flex flex-wrap items-end" style={{ backgroundColor: color }}>
                    <div className="w-full md:w-1/3 mb-3">
                        <h1 className="font-bold text-white text-6xl hidden md:block">
                            Contact
                            <br />
                            Us
                        </h1>
                        <h1 className="font-bold text-white text-4xl block md:hidden">Contact Us</h1>
                    </div>
                    <div className="grow">
                        <form className="text-[#29328d]" encType="multipart/form-data" method="post" ref={form} onSubmit={handleSubmit}>
                            <div className="rounded-tr-xl rounded-bl-xl bg-white px-5 py-2 font-bold flex flex-wrap justify-between items-center space-x-4">
                                <div className="w-full md:w-20">To :</div>
                                <input type="hidden" name="mall" defaultValue={mallId} />
                                <label htmlFor="to_leasing" className="w-full md:w-auto justify-between items-center space-x-4">
                                    <input type="checkbox" id="to_leasing" name="sendTo[]" value="leasing" />
                                    <span>Leasing</span>
                                </label>
                                <label htmlFor="to_event_promotion" className="w-full md:w-auto justify-between items-center space-x-4">
                                    <input type="checkbox" id="to_event_promotion" name="sendTo[]" value="event" />
                                    <span>Event Promotion</span>
                                </label>
                                <label htmlFor="to_customer_care" className="w-full md:w-auto justify-between items-center space-x-4">
                                    <input type="checkbox" id="to_customer_care" name="sendTo[]" value="cs" />
                                    <span>Customer Care</span>
                                </label>
                            </div>
                            <div className="mt-3 rounded-tr-xl rounded-bl-xl bg-white px-5 py-2">
                                <label htmlFor="email" className="relative flex justify-between items-center space-x-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 absolute" viewBox="0 0 512 512">
                                        <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                                    </svg>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full ps-5 focus:outline-none border-none focus:ring-0"
                                        id="email"
                                        name="email"
                                        required
                                    />
                                </label>
                            </div>
                            <div className="mt-3 rounded-tr-xl rounded-bl-xl bg-white px-5 py-2">
                                <label htmlFor="whatsapp" className="relative flex justify-between items-center space-x-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 absolute" viewBox="0 0 448 512">
                                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                    </svg>
                                    <input
                                        type="number"
                                        placeholder="Whatsapp"
                                        className="w-full ps-5 focus:outline-none border-none focus:ring-0"
                                        id="whatsapp"
                                        name="telepon"
                                        required
                                    />
                                </label>
                            </div>
                            <div className="mt-3 rounded-tr-xl rounded-bl-xl bg-white relative overflow-hidden">
                                <label htmlFor="body">
                                    <textarea
                                        className={`${styles.lineRow} focus:outline-none focus:ring-0 w-full px-5 pb-4 body`}
                                        rows={5}
                                        id="body"
                                        name="pesan"
                                        required
                                    />
                                </label>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                                <div className="flex justify-start items-start space-x-4">
                                    {!upload && (
                                        <label
                                            htmlFor="attachment"
                                            className="bg-white rounded-tr-xl rounded-bl-xl p-3 hover:bg-[#29328d] hover:text-white transition-colors duration-300 ease-in-out cursor-pointer"
                                        >
                                            <div className="flex justify-between items-center">
                                                <svg
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                    className="h-6 w-6"
                                                >
                                                    <path
                                                        clipRule="evenodd"
                                                        fillRule="evenodd"
                                                        d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                                                    />
                                                </svg>
                                                <span className={`${attach === 'Attached' ? `text-[#${color}]` : 'text-[#29328d]'} hover:text-white`}>
                                                    {attach}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                id="attachment"
                                                name="attachment"
                                                className="attachment"
                                                accept="image/*,.doc,.docx,.ppt,.pptx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                                                max="5242880"
                                                onChange={() => setAttach('Attached')}
                                                hidden
                                            />
                                        </label>
                                    )}
                                    <button
                                        type="button"
                                        className="rounded-tr-xl rounded-bl-xl bg-white py-3 px-5 hover:bg-[#29328d] hover:text-white transition-colors duration-300 ease-in-out active:bg-[#0c112e]"
                                        onClick={handleReset}
                                    >
                                        Reset
                                    </button>
                                    {upload && <Spinner className="h8 w-8 mt-2" />}
                                </div>

                                <button
                                    type="submit"
                                    className="rounded-tr-xl rounded-bl-xl bg-white py-3 px-5 hover:bg-[#29328d] hover:text-white transition-colors duration-300 ease-in-out active:bg-[#0c112e]"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
