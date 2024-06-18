'use client'
import ConnectWalletEther from "@/components/ConnectWalletEther";
import { TourProvider, useTour } from '@reactour/tour'

export default function Home() {
  const steps = [
    {
      selector: '.first-step',
      content: 'Connect your wallet to get started.',
    },
    {
      selector: '.name-step',
      content: 'Enter name or leave it as default',
    },
    {
      selector: '.second-step',
      content: 'Enter respective wallet address',
    },
    {
      selector: '.third-step',
      content: 'Enter corresponding percentage amount',
    },
    {
      selector: '.fourth-step',
      content: 'Click submit to deploy the smart contract',
    },
  ]

  const styles = 
    {
      popover: (base) =>({
        ...base,
        borderRadius: 20
      }),
      maskArea: (base) => ({ ...base, rx: 20 }),
    }
  
  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <TourProvider steps={steps} styles={styles}
      onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {
        if (steps) {
          if (currentStep === steps.length - 1) {
            setIsOpen(false)
          }
          setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1))
        }
      }}
      >
      <ConnectWalletEther />
      </TourProvider>
    </div>
  );
}
