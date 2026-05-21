import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { X } from 'lucide-react';

const Notifications: React.FC = () => {
    return (
        <MainLayout>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4">
                    Bienvenue sur la page des notifications
                </h1>
                <p className="text-lg">
                    Tout fonctionne correctement ! Cette page est protégée par le layout avec navbar et footer.
                </p>

                <div className="backdrop-blur-sm px-4 flex justify-center mt-8 w-full">
                    <div className="px-8 pb-3 lg:w-[55vw]">

                        <div className="flex flex-col items-center transition-colors duration-200 hover:bg-[#0FAC71] p-4 mb-4 shadow-lg">
                            <div className="w-full flex justify-end">
                                <button type="button" className="">
                                    <X className="w-4 h-4 " />
                                </button>
                            </div>
                            <span className="flex items-center text-start">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore ex doloremque dolores nisi quo, nobis facere sint quae corrupti quis.
                            </span>
                        </div>

                        <div className="flex flex-col items-center transition-colors duration-200 hover:bg-[#0FAC71] p-4 mb-4 shadow-lg">

                            <div className="w-full flex justify-end">
                                <button type="button" className="">
                                    <X className="w-4 h-4 " />
                                </button>
                            </div>
                            <span className="flex items-center text-start">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero velit quas accusantium quae obcaecati repellendus dolore optio fugiat modi eos totam quasi, eum, voluptatem nemo.
                            </span>
                        </div>

                        <div className="flex flex-col items-center hover:bg-[#0FAC71] w-full p-4 mb-4 shadow-lg">
                            <div className="w-full flex justify-end">
                                <button type="button" className="">
                                    <X className="w-4 h-4 " />
                                </button>
                            </div>
                            <span className="flex items-center text-start">
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni doloribus consequuntur perspiciatis maxime nam nemo!
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Notifications;