import ConnectWalletEther from "@/components/ConnectWalletEther";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <ConnectWalletEther />
    </div>
  );
}
