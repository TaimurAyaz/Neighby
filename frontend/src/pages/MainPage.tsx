import { useState, useEffect } from "react";
import { ArrowRightIcon, BarsArrowUpIcon, UsersIcon } from '@heroicons/react/20/solid'
import LoaderView from "../views/LoaderView";
import { LogoView } from "../views/LogoView";

export default function MainPage() {
    const [prompt, setPrompt] = useState<string | undefined>(undefined);
    const [promptResponse, setPromptResponse] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    function onPromptSubmit(e: any) {
        e.preventDefault()
    }

    async function onPrompt() {
        try {
            if (process.env.REACT_APP_SERVICE_MOTHERSHIP_URL !== undefined && prompt !== undefined) {
                setPromptResponse(undefined)
                setIsLoading(true)
                const params = {
                    prompt: prompt
                }
                let response = await fetch(
                    `${process.env.REACT_APP_SERVICE_MOTHERSHIP_URL}/infer`,
                    {
                        mode: 'cors',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(params)
                    }
                )
                if (response.ok) {
                    let responseJSON = await response.json()
                    setPromptResponse(responseJSON.inference)
                } else {
                    throw new Error('/infer: Invalid response');
                }
            } else {
                console.log(process.env.REACT_APP_SERVICE_MOTHERSHIP_URL)
            }
        } catch (error) {
            console.error(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="px-12 py-32 lg:px-8">
            <div className="mx-auto max-w-xl text-base leading-7">
                <div className="flex flex-row pl-4 space-x-1.5">
                    <div className="my-auto">
                        <LogoView className="w-4 h-4 pt-0.5" />
                    </div>
                    <label htmlFor="prompt" className="block text-sm font-medium  text-gray-900 dark:text-gray-400 ml-4">
                        Neighby
                    </label>
                </div>
                <form onSubmit={onPromptSubmit}>
                    <div className="mt-2 flex rounded-full">
                        <div className="relative flex flex-grow items-stretch focus-within:z-10">
                            <input
                                type="text"
                                name="prompt"
                                id="prompt"
                                disabled={isLoading}
                                required
                                contentEditable={!isLoading}
                                onChange={(e) => {
                                    setPrompt(e.target.value)
                                }}
                                className={`block w-full h-12 pl-4 pr-14 rounded-full border-0 py-1.5 text  focus:ring-0 sm:text-sm sm:leading-6 ${isLoading ? "animate-pulse bg-gray-50 text-gray-600 placeholder:text-gray-300 dark:bg-zinc-800 dark:text-gray-400 dark:placeholder:text-gray-600" : "bg-gray-100 text-gray-900  placeholder:text-gray-400 dark:bg-zinc-800 dark:text-gray-400 dark:placeholder:text-gray-600"}`}
                                placeholder="Whats the nearest hospital near 1 Infinite Loop, Cupertino?"
                            />
                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={onPrompt}
                                    className={`relative inline-flex w-10 items-center gap-x-1.5 rounded-full px-3 py-2 text-sm font-semibold ${isLoading ? "bg-transparent" : "hover:bg-indigo-400 bg-indigo-600 "}`}
                                >
                                    {
                                        isLoading ?
                                            <LoaderView additionalSpinnerClasses="bg-white dark:bg-white" />
                                            :
                                            <ArrowRightIcon className="-ml-0.5 mt-[1] h-5 w-5 text-white" aria-hidden="true" />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <div>
                    {
                        isLoading ?
                            <div className="rounded-md p-4 w-full mx-auto">
                                <div className="animate-pulse flex space-x-4">
                                    <div className="flex-1 space-y-6 py-1">
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="h-2 bg-zinc-800 rounded col-span-3"></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-2 bg-zinc-800 rounded col-span-2"></div>
                                        </div>
                                        <div className="grid grid-cols-6 gap-4">
                                            <div className="h-2 bg-zinc-800 rounded col-span-1"></div>
                                            <div className="h-2 bg-zinc-800 rounded col-span-4"></div>
                                        </div>
                                        <div className="grid grid-cols-8 gap-4">
                                            <div className="h-2 bg-zinc-800 rounded col-span-7"></div>
                                        </div>
                                        <div className="grid grid-cols-6 gap-4">
                                            <div className="h-2 bg-zinc-800 rounded col-span-3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="pt-5 p-4 text-sm text-gray-800 dark:text-gray-400">
                                <pre className="font-sans text-wrap">{promptResponse}</pre>
                            </div>
                    }
                </div>

            </div>

        </div>
    )
}
