'use client'
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import DarkMode from '@/components/toggle-theme';
import Link from 'next/link';
import DropDown from '@/components/DropDown';
import toast, { Toaster } from 'react-hot-toast';
import { abi } from '@/utils/constants';

const page = ({ params }) => {
  const [connectedAccount, setConnectedAccount] = useState('');
  const [deployedContracts, setdeployedContracts] = useState([])
  const [contractDetails, setContractDetails] = useState([])
  const [balance, setBalance] = useState("0.0")
  const [selectedToken, setSelectedToken] = useState("0xF9B9B40FD1d6f1d155ded0b5d0c3db9Cedc56064");

  async function getTokenBalance() {
    if (window.ethereum) {
      try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          console.log('Signer:', selectedToken)

          const USDContract = new ethers.Contract(params.sc, abi, provider);

          const fun = await USDContract.contractERC20Balance(selectedToken)
          // const fun = await USDContract.balanceOf()
          // console.log("Contract ERC Balance", ethers.formatEther(fun));
          setBalance(ethers.formatEther(fun));

      } catch (error) {
          toast.error('Error', {
              style: {
                  borderRadius: '20px',
                  background: '#7888a5',
                  color: '#fff',
                  padding: '12px',
              },
          });
          console.error('Error interacting Contract:', error.message);
      }
  } else {
      alert('Please Retry');
  }
  }

  async function disusd() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const USDContract = new ethers.Contract(params.sc, abi, provider);
            const contractWithSigner = USDContract.connect(signer)

            const fun = await contractWithSigner.distributeToken(selectedToken)
            console.log("Executing Function", fun);

            toast.promise(
                // await fun.wait();
                (await fun).wait(),
                {
                    loading: <b>Distributing Funds...</b>,
                    success: <b>Success!</b>,
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

        } catch (error) {
            toast.error('Error', {
                style: {
                    borderRadius: '20px',
                    background: '#7888a5',
                    color: '#fff',
                    padding: '12px',
                },
            });
            console.error('Error interacting Contract:', error.message);
        }
    } else {
        alert('Please Retry');
    }
}

  const handleSelect = (value) => {
    setSelectedToken(value);
  };

  async function getContents() {
    try {
      const response = await fetch(`http://localhost:3000/api/contract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ contract: params.sc })
      })

      if (!response.ok) {
        console.log(response)
        throw new Error("Network response was not ok");
      }
      const add = await response.json();
      // console.log("This is params", add.message);
      setContractDetails(add.message)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getContents()
  }, [])


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
      setdeployedContracts(add.message)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center py-10'>
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

      <div className='flex w-full gap-8 px-1 justify-center'>
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
          <h1 className='font-bold text-2xl pb-2 text-white'>Contract Details</h1>
          <div className='flex flex-col w-full items-center gap-4 mt-4 font-bold'>
            {contractDetails && contractDetails.map((contractDetails, index) => (
              <div key={index} className='w-full'>
                <div className='flex w-full justify-between text-center px-4 gap-12'>
                  <p className='text-white'>{index + 1}</p>
                  <p className='text-white'>{contractDetails.transfer_wallet_name}</p>
                  <p className='text-white'>{contractDetails.transfer_wallet_address}</p>
                  <p className='text-white'>{contractDetails.transfer_percentage}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='flex w-full bg-white/10 dark:bg-zinc-900/50 border-[1px] border-white/20 mt-8 backdrop-blur-md rounded-2xl py-5 justify-between items-center px-6'>
            <DropDown onSelect={handleSelect} />
            <div className='flex gap-6 items-center'>
              <p className='text-white font-bold'>{balance}</p>
              <button className="bg-emerald-500 px-3 py-1 rounded-xl text-white font-bold" onClick={getTokenBalance}>Check Balance</button>
              <button className="bg-purple-600 px-3 py-1 rounded-xl text-white font-bold" onClick={disusd}>Withdraw</button>
            </div>
          </div>

        </div>
      </div>
      <Toaster containerStyle={{
                top: 400,
                left: 20,
                bottom: 20,
                right: 20,
            }}></Toaster>
    </div>
  )
}

export default page