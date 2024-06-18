"use client"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const DropDown = ({ onSelect }) => {
    const [position, setPosition] = useState("bottom")

    const handleChange = (value) => {
        setPosition(value);
        if (onSelect) {
            onSelect(value);
        }
    };

    const getButtonText = (value) => {
        switch (value) {
            case "0xdAC17F958D2ee523a2206206994597C13D831ec7":
                return "USDT - Ethereum";
            case "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48":
                return "USDC - Ethereum";
            case "0xc2132D05D31c914a87C6611C10748AEb04B58e8F":
                return "USDT - Polygon";
            case "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359":
                return "USDC - Polygon";
            default:
                return "Token";
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="bg-purple-600 px-3 py-1 rounded-xl text-white font-bold">{getButtonText(position)}</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={position} onValueChange={handleChange} className="font-bold">
                    <DropdownMenuRadioItem value="0xdAC17F958D2ee523a2206206994597C13D831ec7">USDT - Ethereum
                        <img src="/eth.png" alt="Eth" className="w-4 ml-2" />
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48">USDC - Ethereum
                        <img src="/eth.png" alt="eth" className="w-4 ml-2" />
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="0xc2132D05D31c914a87C6611C10748AEb04B58e8F">USDT - Polygon
                        <img src="/polygon.png" alt="polygon" className="w-4 ml-2" />
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359">
                        USDC - Polygon
                        <img src="/polygon.png" alt="polygon" className="w-4 ml-2" />
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropDown