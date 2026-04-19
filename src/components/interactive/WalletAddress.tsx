import { useState } from "react";
import { ethers } from "ethers";

const WalletAddress = () => {
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");

    const verifyAddress = () => {
        try {
            // check if valid Ethereum-style address
            const isValid = ethers.isAddress(input);

            if (isValid) {
                setStatus("success");
            } else {
                setStatus("failed");
            }
        } catch {
            setStatus("failed");
        }
    };

    return (
        <div className="text-center space-y-3">
            <h2>Enter Your Wallet Address</h2>

            <input
                type="text"
                placeholder="0x..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border px-2 py-1 rounded w-80"
            />

            <button
                onClick={verifyAddress}
                className="px-4 py-2 bg-blue-700 text-white rounded"
            >
                Verify
            </button>

            <p>Status: {status}</p>
        </div>
    );
};

export default WalletAddress;