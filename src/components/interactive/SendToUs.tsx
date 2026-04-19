import { useState } from "react";
import { ethers } from "ethers";

const SendToUs = () => {
    const [txHash, setTxHash] = useState("");
    const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");

    const HELA_RPC = "https://testnet-rpc.helachain.com";

    // 👉 PUT YOUR RECEIVING ADDRESS HERE
    const APP_ADDRESS = "0x28D617d36a02A6367F9ABfF6039C7f1A650Dd0b7";

    const verifyTransaction = async () => {
        try {
            if (!(window as any).ethereum) {
                alert("Install MetaMask");
                return;
            }

            // 1. Connect wallet
            const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
            await browserProvider.send("eth_requestAccounts", []);
            const signer = await browserProvider.getSigner();
            const userAddress = await signer.getAddress();

            // 2. Use Hela RPC to fetch transaction
            const provider = new ethers.JsonRpcProvider(HELA_RPC);
            const tx = await provider.getTransaction(txHash);

            if (!tx) {
                setStatus("failed");
                return;
            }

            // 3. Normalize addresses
            const from = tx.from.toLowerCase();
            const to = tx.to?.toLowerCase();
            const user = userAddress.toLowerCase();
            const app = APP_ADDRESS.toLowerCase();

            // 4. Verify conditions
            if (from === user && to === app) {
                setStatus("success");
            } else {
                setStatus("failed");
            }

        } catch (err) {
            console.error(err);
            setStatus("failed");
        }
    };

    return (
        <div className="text-center space-y-3">
            <h2>Send to Us token : {APP_ADDRESS}</h2>

            <input
                type="text"
                placeholder="Enter transaction hash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="border px-2 py-1 rounded w-80"
            />

            <button
                onClick={verifyTransaction}
                className="px-4 py-2 bg-blue-700 text-white rounded"
            >
                Verify
            </button>

            <p>Status: {status}</p>
        </div>
    );
};

export default SendToUs;