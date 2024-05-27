import Link from "next/link"
const page = () => {
    return (
        <div className='flex flex-col min-w-full p-16 text-white items-center'>
            <h1 className='text-3xl font-bold text-center'>Instructions</h1>
            <div className='flex flex-col max-w-1/2 bg-white/30 p-8 rounded-3xl gap-4 text-[18px] font-semibold text-balance mt-8'>
                <p>1. Before connecting your wallet, Please choose which blockchain network you want to deploy to inside your metamask. </p>
                <p>2. Connect your wallet</p>
                <p>3. Paste the wallet address and enter the percentage that will be given for that wallet.</p>
                <p>4. Take note that the total percentages must add up to 100%.</p>
                <p>5. Click Submit to deploy the smart contract.</p>
                <p>6. After it is succesfully deployed you can copy and paste the contract address or the transaction ID to view it on your respective block explorer.</p>
                <div className="flex justify-center mt-4">
                    <button className="bg-[#2c2c6e] hover:bg-[#2c2c6e] text-white font-bold py-2 px-4 rounded-2xl w-fit">
                        <Link href={"/"}>Back</Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default page