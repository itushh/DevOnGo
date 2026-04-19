import { useState, useEffect } from "react";
import { Button } from "../ui/Button";

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

export default function HelaConnect() {
    const [account, setAccount] = useState<string | null>(null);
    const [network, setNetwork] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isMetaMaskInstalled = () =>
        typeof window !== "undefined" && Boolean((window as any).ethereum?.isMetaMask);

    const switchToHelaTestnet = async () => {
        try {
            await (window as any).ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: HELA_TESTNET.chainId }],
            });
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                await (window as any).ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [HELA_TESTNET],
                });
            } else {
                throw switchError;
            }
        }
    };

    const connect = async () => {
        setError(null);
        setLoading(true);
        try {
            if (!isMetaMaskInstalled()) {
                throw new Error("MetaMask is not installed.");
            }

            const accounts = await (window as any).ethereum.request({
                method: "eth_requestAccounts",
            });

            await switchToHelaTestnet();

            const chainId = await (window as any).ethereum.request({ method: "eth_chainId" });

            setAccount(accounts[0]);
            setNetwork(parseInt(chainId, 16));
        } catch (err: any) {
            setError(err.message || "Connection failed.");
        } finally {
            setLoading(false);
        }
    };

    const disconnect = () => {
        setAccount(null);
        setNetwork(null);
        setError(null);
    };

    // Check if already connected on mount
    useEffect(() => {
        const checkConnection = async () => {
            if (isMetaMaskInstalled()) {
                const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
                    setAccount(accounts[0]);
                    setNetwork(parseInt(chainId, 16));
                }
            }
        };
        checkConnection();
    }, []);

    if (account) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">Hela Testnet</span>
                    <span className="text-xs font-mono text-brand-ink">
                        {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={disconnect}
                    className="h-8 px-3 rounded-full border border-brand-border hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    Disconnect
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            {error && <span className="text-[10px] text-red-500 font-medium whitespace-nowrap">{error}</span>}
            {!isMetaMaskInstalled() ? (
                <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-brand-ink text-white hover:bg-brand-ink/90 px-3 py-1.5 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                    Install MetaMask
                </a>
            ) : (
                <Button
                    onClick={connect}
                    disabled={loading}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 px-6"
                >
                    {loading ? "Connecting..." : "Connect Wallet"}
                </Button>
            )}
        </div>
    );
}
