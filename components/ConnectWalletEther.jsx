'use client'
import { useState, useEffect } from 'react';
import { ContractFactory, ethers } from "ethers";
import { abi, bytecode } from '@/utils/constants';
import toast, { Toaster } from 'react-hot-toast';
import { useTour } from '@reactour/tour'
import DarkMode from './toggle-theme';
import Link from 'next/link';

const ConnectWalletEther = () => {
    const { setIsOpen } = useTour()

    const [connectedAccount, setConnectedAccount] = useState('');
    const [contractAddress, setcontractAddress] = useState("")
    const [txhash, settxhash] = useState("")
    const [deployedContracts, setdeployedContracts] = useState([])

    const [name1, setName1] = useState("Wallet 1")
    const [name2, setName2] = useState("Wallet 2")
    const [name3, setName3] = useState("Wallet 3")
    const [name4, setName4] = useState("Wallet 4")
    const [name5, setName5] = useState("Wallet 5")

    const [wallet1, setWallet1] = useState("0x0000000000000000000000000000000000000000")
    const [wallet2, setWallet2] = useState("0x0000000000000000000000000000000000000000")
    const [wallet3, setWallet3] = useState("0x0000000000000000000000000000000000000000")
    const [wallet4, setWallet4] = useState("0x0000000000000000000000000000000000000000")
    const [wallet5, setWallet5] = useState("0x0000000000000000000000000000000000000000")

    const [percent1, setPercent1] = useState(0)
    const [percent2, setPercent2] = useState(0)
    const [percent3, setPercent3] = useState(0)
    const [percent4, setPercent4] = useState(0)
    const [percent5, setPercent5] = useState(0)

    const [totalPercent, setTotalPercent] = useState(0);

    const handleInputChange = (setPercent) => (e) => {
        const value = e.target.value === '' ? 0 : e.target.value;
        setPercent(value);
    };

    const updateTotalPercent = () => {
        const numPercent1 = Number(percent1);
        const numPercent2 = Number(percent2);
        const numPercent3 = Number(percent3);
        const numPercent4 = Number(percent4);
        const numPercent5 = Number(percent5);

        // Calculate the total using the converted numbers
        const newTotal = numPercent1 + numPercent2 + numPercent3 + numPercent4 + numPercent5;
        setTotalPercent(newTotal);
    };

    async function getDeployed(wallet) {
        try {
            const response = await fetch(`http://localhost:3000/api/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ wallet })
            })

            if (!response.ok) {
                console.log(response)
                throw new Error("Network response was not ok");
            }
            const add = await response.json();
            console.log("This is add", add.message);
            setdeployedContracts(add.message)
        } catch (error) {
            console.log(error)
        }
    }

    async function updateUserDb(wallet, contract) {
        try {
            const response = await fetch(`http://localhost:3000/api/user`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ wallet, contractAddress: contract })
            })

            let x = await response.json();

            if (!response.ok) {
                console.log(response)
                throw new Error("Network response was not ok");
            }

            return x.affectedId;

        } catch (error) {
            console.log(error)
        }
    }

    async function updateScDb(y) {
        try {
            const response = await fetch(`http://localhost:3000/api/contract`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([
                    {
                        "name": name1,
                        "wallet": wallet1,
                        "percentage": percent1,
                        "id": y
                    },
                    {
                        "name": name2,
                        "wallet": wallet2,
                        "percentage": percent2,
                        "id": y
                    },
                    {
                        "name": name3,
                        "wallet": wallet3,
                        "percentage": percent3,
                        "id": y
                    },
                    {
                        "name": name4,
                        "wallet": wallet4,
                        "percentage": percent4,
                        "id": y
                    },
                    {
                        "name": name5,
                        "wallet": wallet5,
                        "percentage": percent5,
                        "id": y
                    },
                ])
            })

            if (!response.ok) {
                console.log(response)
                throw new Error("Network response was not ok");
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        updateTotalPercent();
    }, [percent1, percent2, percent3, percent4, percent5]);

    async function connectMetamask() {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const account = signer.address

                if (account) {
                    setConnectedAccount(signer.address);
                    getDeployed(signer.address);
                } else {
                    alert('No account available. Please check your Metamask setup.');
                }
            } catch (error) {
                console.error('Error connecting Metamask:', error.message);
            }
        } else {
            alert('Please download Metamask');
        }
    }

    async function deployContract() {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const account = signer.address

                if (totalPercent !== 100) {
                    toast.error(
                        <div>
                            <b>
                                Percentages must add up to 100%.
                            </b>
                        </div>
                        , {
                            style: {
                                borderRadius: '20px',
                                background: '#7888a5',
                                color: '#fff',
                                padding: '12px',
                                textAlign: 'center',
                            },
                        });
                    return;
                }

                const myContract = new ContractFactory(abi, bytecode, signer);

                const contractDeployer = myContract.deploy(
                    wallet1, percent1, wallet2, percent2, wallet3, percent3, wallet4, percent4, wallet5, percent5,
                )

                toast.promise(
                    (await contractDeployer).waitForDeployment(),
                    {
                        loading: <b>Deploying Contract...</b>,
                        success: <b>Succesfully Deployed!</b>,
                        error: <b>Error</b>,
                    },
                    {
                        style: {
                            borderRadius: '20px',
                            background: '#7888a5',
                            color: '#fff',
                            padding: '12px',
                        },
                    }
                );

                // console.log('Contract deployed at: ' + (await contractDeployer).target);
                setcontractAddress((await contractDeployer).target);
                const result = (await contractDeployer).deploymentTransaction();
                console.log('Transaction Details: ', result);
                settxhash(result.hash);

                const add = (await contractDeployer).target;

                const y = await updateUserDb(account, add)
                getDeployed(account);
                await updateScDb(y);

            } catch (error) {
                toast.error('Error', {
                    style: {
                        borderRadius: '20px',
                        background: '#7888a5',
                        color: '#fff',
                        padding: '12px',
                    },
                });
                console.error('Error Deploying Contract:', error.message);
            }
        } else {
            alert('Please Retry');
        }
    }

    function pasteWallets() {
        navigator.clipboard.readText()
            .then(text => {
                console.log('Pasted content: ', text);
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    }

    function copy() {
        navigator.clipboard.writeText(contractAddress)
        toast.success('Copied', {
            style: {
                borderRadius: '20px',
                background: '#7888a5',
                color: '#fff',
                padding: '12px',
            },
        });
    }

    function copyTx() {
        navigator.clipboard.writeText(txhash)
        toast.success('Copied', {
            style: {
                borderRadius: '20px',
                background: '#7888a5',
                color: '#fff',
                padding: '12px',
            },
        });
    }


    return (
        <>
            <div className=' bg-white/30 dark:bg-zinc-500/20 border-[1px] border-white/20 backdrop-blur-md rounded-3xl py-2 flex justify-between items-center px-8 first-step max-w-7xl w-full h-24'>
                {connectedAccount ?
                    <h1 className='text-white font-bold text-[20px] flex items-center'>
                        <p className='text-purple-600 text-[25px]'>Welcome &nbsp;</p>
                        {connectedAccount}
                    </h1> :
                    <button className="w-52 rounded-2xl bg-purple-600 px-4 py-3 font-bold text-white" onClick={() => connectMetamask()}>Connect to Metamask</button>}
                <div className='flex gap-12'>
                    <Link href={'/'} className='font-bold underline text-slate-100 hover:text-purple-600'>Home</Link>
                    <DarkMode />
                </div>
            </div>

            <div className='flex w-full gap-8 px-24 justify-center'>
                <div className='bg-white/30 dark:bg-zinc-500/20 border-[1px] border-white/20 backdrop-blur-lg rounded-3xl flex flex-col items-center px-8 py-6 mt-8 text-white'>
                    <p className='font-bold text-xl'>Deployed Contract</p>
                    <div className='mt-8 gap-4 flex flex-col'>
                        {deployedContracts && deployedContracts.map(add => (
                            <div className='flex flex-col font-bold' key={add}>
                                <Link href={`/${add}`}>{add}</Link>
                            </div>
                        ))}

                    </div>
                </div>

                <div className='bg-white/30 dark:bg-zinc-500/20 border-[1px] border-white/20 backdrop-blur-lg rounded-3xl flex flex-col items-center px-16 py-8 mt-8'>
                    <h1 className='font-bold text-2xl pb-2 text-white'>Deploy Contract</h1>

                    <div className='w-full flex justify-center gap-8 py-4'>
                        <div className='flex gap-4'>
                            <input className='font-bold bg-purple-500 px-4 py-2 rounded-xl text-white placeholder:text-white text-center name-step' placeholder={name1} onChange={(e) => setName1(e.target.value)} />
                            <input className='outline-none rounded-xl w-[460px] text-center px-4 bg-slate-100 dark:bg-slate-700 second-step' type="text" placeholder='0x147f20a28739da1........' onChange={(e) => setWallet1(e.target.value)} />
                            {/* <button className='bg-slate-500 px-4 py-2 rounded-xl text-white' onClick={() => pasteWallets()}>Paste</button> */}
                        </div>
                        <input className='outline-none rounded-xl w-[100px] text-center px-4 bg-slate-100 dark:bg-slate-700 third-step' min="0" max="100" type="number" placeholder='80%' onChange={handleInputChange(setPercent1)} />
                    </div>

                    <div className='w-full flex justify-center gap-8 py-4'>
                        <div className='flex gap-4'>
                            <input className='font-bold bg-yellow-500 px-4 py-2 rounded-xl text-white placeholder:text-white text-center' placeholder={name2} onChange={(e) => setName2(e.target.value)} />
                            <input className='outline-none rounded-xl w-[460px] text-center px-4 bg-slate-100 dark:bg-slate-700' type="text" placeholder='0x147f20a28739da1........' onChange={(e) => setWallet2(e.target.value)} />
                        </div>
                        <input className='outline-none rounded-xl w-[100px] text-center px-4 bg-slate-100 dark:bg-slate-700' min="0" max="100" type="number" placeholder='15%' onChange={handleInputChange(setPercent2)} />
                    </div>

                    <div className='w-full flex justify-center gap-8 py-4'>
                        <div className='flex gap-4'>
                            <input className='font-bold bg-blue-500 px-4 py-2 rounded-xl text-white placeholder:text-white text-center' placeholder={name3} onChange={(e) => setName3(e.target.value)} />
                            <input className='outline-none rounded-xl w-[460px] text-center px-4 bg-slate-100 dark:bg-slate-700' type="text" placeholder='0x147f20a28739da1........' onChange={(e) => setWallet3(e.target.value)} />
                        </div>
                        <input className='outline-none rounded-xl w-[100px] text-center px-4 bg-slate-100 dark:bg-slate-700' min="0" max="100" type="number" placeholder='2%' onChange={handleInputChange(setPercent3)} />
                    </div>

                    <div className='w-full flex justify-center gap-8 py-4'>
                        <div className='flex gap-4'>
                            <input className='font-bold bg-green-500 px-4 py-2 rounded-xl text-white placeholder:text-white text-center' placeholder={name4} onChange={(e) => setName4(e.target.value)} />
                            <input className='outline-none rounded-xl w-[460px] text-center px-4 bg-slate-100 dark:bg-slate-700' type="text" placeholder='0x147f20a28739da1........' onChange={(e) => setWallet4(e.target.value)} />
                        </div>
                        <input className='outline-none rounded-xl w-[100px] text-center px-4 bg-slate-100 dark:bg-slate-700' min="0" max="100" type="number" placeholder='2%' onChange={handleInputChange(setPercent4)} />
                    </div>

                    <div className='w-full flex justify-center gap-8 py-4'>
                        <div className='flex gap-4'>
                            <input className='font-bold bg-red-500 px-4 py-2 rounded-xl text-white placeholder:text-white text-center' placeholder={name5} onChange={(e) => setName5(e.target.value)} />
                            <input className='outline-none rounded-xl w-[460px] text-center px-4 bg-slate-100 dark:bg-slate-700' type="text" placeholder='0x147f20a28739da1........' onChange={(e) => setWallet5(e.target.value)} />
                        </div>
                        <input className='outline-none rounded-xl w-[100px] text-center px-4 bg-slate-100 dark:bg-slate-700' min="0" max="100" type="number" placeholder='1%' onChange={handleInputChange(setPercent5)} />
                    </div>

                    <button className='bg-blue-600 px-4 py-2 rounded-xl text-white font-bold text-lg mt-4 fourth-step' onClick={deployContract}>Submit</button>
                    <div className='text-[13px] font-semibold pt-2 text-white w-full flex justify-between'>
                        <div>
                            <p>*Percentage total must add up to 100%</p>
                            <p>*Minimum two wallets maximum five wallets</p>
                            <p>*Every amount will be charged 0.1% before delegating amount</p>
                        </div>
                        <div className='flex items-end' onClick={() => setIsOpen(true)}>
                            <span className='flex gap-1 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#e8eaed"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                                <p className='cursor-pointer text-[14px] hover:underline'>Instructions</p>
                            </span>
                        </div>
                        {/* <button onClick={() => setIsOpen(true)}>Open Tour</button> */}
                    </div>
                </div>
            </div>

            <div className=' bg-white/30 dark:bg-zinc-500/20 border-[1px] border-white/20 backdrop-blur-md rounded-3xl flex flex-col justify-center items-center px-16 py-4 mt-8 font-bold text-white text-[18px]'>
                <div className='flex w-full justify-center items-center py-2'>
                    Deployed Contract Address :&nbsp;
                    {contractAddress &&
                        <div className='flex items-center cursor-pointer' onClick={copy}>
                            {contractAddress}
                            <span className='ml-1'> <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a2 2 0 0 0-1 .3V5c0-1.1.9-2 2-2h7Z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M8 7v4H4.2c0-.2.2-.3.3-.4l2.4-2.9A2 2 0 0 1 8 7.1Zm2 0v4a2 2 0 0 1-2 2H4v6c0 1.1.9 2 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" clipRule="evenodd" />
                            </svg>
                            </span>
                        </div>
                    }
                </div>

                <div className='flex w-full justify-center items-center py-2'>
                    Tx Hash :&nbsp;
                    {txhash &&
                        <div className='flex items-center cursor-pointer' onClick={copyTx}>
                            {txhash}
                            <span className='ml-1'> <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a2 2 0 0 0-1 .3V5c0-1.1.9-2 2-2h7Z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M8 7v4H4.2c0-.2.2-.3.3-.4l2.4-2.9A2 2 0 0 1 8 7.1Zm2 0v4a2 2 0 0 1-2 2H4v6c0 1.1.9 2 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" clipRule="evenodd" />
                            </svg>
                            </span>
                        </div>
                    }
                </div>
            </div>

            <Toaster containerStyle={{
                top: 400,
                left: 20,
                bottom: 20,
                right: 20,
            }}></Toaster>
        </>
    )
}

export default ConnectWalletEther