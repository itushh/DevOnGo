import { useState } from "react";

const HELA_TESTNET = {
    chainId: "0xA2D08",
    chainName: "Hela Blockchain Testnet",
    nativeCurrency: {
        name: "HLUSD",
        symbol: "HLUSD",
        decimals: 18,
    },
    rpcUrls: ["https://testnet-rpc.helachain.com"],
    blockExplorerUrls: ["https://testnet-blockexplorer.helachain.com"],
};

const CheckHelaConnection = () => {
    const [status, setStatus] = useState<"success" | "failed" | "pending">("pending");
    const [error, setError] = useState<string | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);

    const isMetaMaskInstalled = () =>
        typeof window !== "undefined" && Boolean((window as any).ethereum?.isMetaMask);

    const checkConnection = async () => {
        if (!isMetaMaskInstalled()) {
            setStatus("failed");
            setError("MetaMask is not installed");
            return;
        }

        try {
            const accounts = await (window as any).ethereum.request({
                method: "eth_requestAccounts",
            });
    
            if (accounts.length === 0) {
                setStatus("failed");
                setError("Not connected to Any Network");
                return;
            }
        } catch (err) {
            console.error("Error checking connection:", err);
            setStatus("failed");
            setError("Error connecting to Network");
            return;
        }

        try {
            await (window as any).ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: HELA_TESTNET.chainId }],
            });
            setStatus("success");
            setChainId(HELA_TESTNET.chainId);
        } catch (switchError) {
            setStatus("failed");
            setError("Hela Testnet is not added to MetaMask");
            return;
        }
    }

    return (
        <div>
            <p>Task : Connect to Hela</p>
            <button onClick={checkConnection} className="px-4 py-2 bg-blue-500 text-white rounded">Done</button>
            <p>{status}</p>
            {status === "failed" && <p className="text-red-500">{error}</p>}
            {status === "success" && <p className="text-green-500">Chain ID: {chainId})</p>}
        </div>
    )
}

export default CheckHelaConnection;