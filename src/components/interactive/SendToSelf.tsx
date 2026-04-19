import { useState } from "react";
import { ethers } from "ethers";

const SendToSelf = () => {
    const [txHash, setTxHash] = useState("");
    const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");

    const HELA_RPC = "https://testnet-rpc.helachain.com";

    const verifyTx = async () => {
        try {
            if (!(window as any).ethereum) {
                alert("Install MetaMask");
                return;
            }

            // connect wallet
            const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
            await browserProvider.send("eth_requestAccounts", []);
            const signer = await browserProvider.getSigner();
            const userAddress = await signer.getAddress();

            // use Hela RPC to fetch tx
            const provider = new ethers.JsonRpcProvider(HELA_RPC);

            // get transaction
            const tx = await provider.getTransaction(txHash);

            if (!tx) {
                setStatus("failed");
                return;
            }

            // normalize addresses
            const from = tx.from.toLowerCase();
            const to = tx.to?.toLowerCase();
            const user = userAddress.toLowerCase();

            // check self-transfer
            if (from === user && to === user) {
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
            <h2>Verify Self Transfer</h2>

            <input
                type="text"
                placeholder="Enter transaction hash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="border px-2 py-1 rounded w-80"
            />

            <button
                onClick={verifyTx}
                className="px-4 py-2 bg-blue-700 text-white rounded"
            >
                Verify
            </button>

            <p>Status: {status}</p>
        </div>
    );
};

export default SendToSelf;