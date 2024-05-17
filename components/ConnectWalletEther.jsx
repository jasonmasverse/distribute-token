'use client'
import { useState, useEffect } from 'react';
import { ContractFactory, ethers } from "ethers";
import { abi, bytecode } from '@/utils/constants';
import toast, { Toaster } from 'react-hot-toast';

const ConnectWalletEther = () => {
    const [connectedAccount, setConnectedAccount] = useState('');
    const [contractAddress, setcontractAddress] = useState("")
    const [txhash, settxhash] = useState("")

    const [wallet1, setWallet1] = useState("0x0000000000000000000000000000000000000000")
    const [percent1, setPercent1] = useState(0)
    const [wallet2, setWallet2] = useState("0x0000000000000000000000000000000000000000")
    const [percent2, setPercent2] = useState(0)
    const [wallet3, setWallet3] = useState("0x0000000000000000000000000000000000000000")
    const [percent3, setPercent3] = useState(0)
    const [wallet4, setWallet4] = useState("0x0000000000000000000000000000000000000000")
    const [percent4, setPercent4] = useState(0)
    const [wallet5, setWallet5] = useState("0x0000000000000000000000000000000000000000")
    const [percent5, setPercent5] = useState(0)

    const [totalPercent, setTotalPercent] = useState(0);

    const updateTotalPercent = () => {
        const newTotal = percent1 + percent2 + percent3 + percent4 + percent5;
        setTotalPercent(newTotal);
    };

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
                    return; // Prevent deployment if percentages don't add up
                }

                const myContract = new ContractFactory(abi, bytecode, signer);

                const contractDeployer = myContract.deploy(
                    wallet1, percent1, wallet2, percent2, wallet3, percent3, wallet4, percent4, wallet5, percent5
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

                console.log('Contract deployed at hahaha: ' + (await contractDeployer).target);
                setcontractAddress((await contractDeployer).target);

                const result = (await contractDeployer).deploymentTransaction();
                console.log('Transaction Details: ', result);
                settxhash(result.hash);

                const joke = (await contractDeployer).waitForDeployment()
                console.log('This is a joke: ', await joke);

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

    return (
        <>
            <div className=' bg-white/30 backdrop-blur-md rounded-3xl py-4 flex justify-center items-center px-8'>
                {connectedAccount ? <h1 className='text-white font-bold text-[20px]'>{connectedAccount}</h1> : <button className="w-52 rounded-2xl bg-purple-600 px-4 py-3 font-bold text-white" onClick={() => connectMetamask()}>Connect to Metamask</button>}
            </div>

            <div className=' bg-white/30 backdrop-blur-lg rounded-3xl flex flex-col items-center px-20 py-8 mt-8'>
                <h1 className='font-bold text-2xl pb-2 text-white'>Deploy Contract</h1>

                <div className='w-full flex justify-center gap-8 py-4'>
                    <div className='flex gap-4'>
                        <span className='font-bold bg-purple-500 px-4 py-2 rounded-3xl text-white'>Wallet 1</span>
                        <input className='outline-none rounded-xl w-[460px] text-center px-4' type="text" placeholder='0x147f20a28739da1........
' onChange={(e) => setWallet1(e.target.value)} />
                        {/* <button className='bg-slate-500 px-4 py-2 rounded-xl text-white' onClick={() => pasteWallets()}>Paste</button> */}
                    </div>
                    <input className='outline-none rounded-xl w-[100px] text-center px-4' min="0" max="100" type="number" placeholder='80%' onChange={(e) => setPercent1(e.target.value)} />
                </div>

                <div className='w-full flex justify-center gap-8 py-4'>
                    <div className='flex gap-4'>
                        <span className='font-bold bg-yellow-500 px-4 py-2 rounded-3xl text-white'>Wallet 2</span>
                        <input className='outline-none rounded-xl w-[460px] text-center px-4' type="text" placeholder='0x147f20a28739da1........
' onChange={(e) => setWallet2(e.target.value)} />
                    </div>
                    <input className='outline-none rounded-xl w-[100px] text-center px-4' min="0" max="100" type="number" placeholder='15%' onChange={(e) => setPercent2(e.target.value)} />
                </div>

                <div className='w-full flex justify-center gap-8 py-4'>
                    <div className='flex gap-4'>
                        <span className='font-bold bg-blue-500 px-4 py-2 rounded-3xl text-white'>Wallet 3</span>
                        <input className='outline-none rounded-xl w-[460px] text-center px-4' type="text" placeholder='0x147f20a28739da1........
' onChange={(e) => setWallet3(e.target.value)} />
                    </div>
                    <input className='outline-none rounded-xl w-[100px] text-center px-4' min="0" max="100" type="number" placeholder='2%' onChange={(e) => setPercent3(e.target.value)} />
                </div>

                <div className='w-full flex justify-center gap-8 py-4'>
                    <div className='flex gap-4'>
                        <span className='font-bold bg-green-500 px-4 py-2 rounded-3xl text-white'>Wallet 4</span>
                        <input className='outline-none rounded-xl w-[460px] text-center px-4' type="text" placeholder='0x147f20a28739da1........
' onChange={(e) => setWallet4(e.target.value)} />
                    </div>
                    <input className='outline-none rounded-xl w-[100px] text-center px-4' min="0" max="100" type="number" placeholder='2%' onChange={(e) => setPercent4(e.target.value)} />
                </div>

                <div className='w-full flex justify-center gap-8 py-4'>
                    <div className='flex gap-4'>
                        <span className='font-bold bg-red-500 px-4 py-2 rounded-3xl text-white'>Wallet 5</span>
                        <input className='outline-none rounded-xl w-[460px] text-center px-4' type="text" placeholder='0x147f20a28739da1........
' onChange={(e) => setWallet5(e.target.value)} />
                    </div>
                    <input className='outline-none rounded-xl w-[100px] text-center px-4' min="0" max="100" type="number" placeholder='1%' onChange={(e) => setPercent5(e.target.value)} />
                </div>

                <button className='bg-blue-600 px-4 py-2 rounded-xl text-white font-bold text-lg mt-4' onClick={deployContract}>Submit</button>
                <div className='text-[13px] font-semibold pt-2 text-white w-full'>
                    <p>*Percentage total must add up to 100%</p>
                    <p>*Minimum two wallets maximum five wallets</p>
                </div>
            </div>

            <div className=' bg-white/30 backdrop-blur-md rounded-3xl flex flex-col justify-center items-center px-16 py-4 mt-8 font-bold text-white text-[18px]'>
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
                        <div className='flex items-center cursor-pointer' onClick={copy}>
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