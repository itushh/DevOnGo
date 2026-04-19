import { useState, useCallback, useEffect } from "react";
import { HELA_TESTNET } from "../services/blockchainService";
import { useUser } from "./useUser";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export function useHelaWallet() {
    const { user, setUser } = useUser();
    const [account, setAccount] = useState<string | null>(null);
    const [network, setNetwork] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isMetaMaskInstalled = useCallback(() =>
        typeof window !== "undefined" && Boolean((window as any).ethereum?.isMetaMask), []);

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

            // Sync with Firebase if user exists
            if (user && user.wallet_address !== accounts[0]) {
                const userDocRef = doc(db, 'users', user.id);
                await updateDoc(userDocRef, { wallet_address: accounts[0] });
                setUser({ ...user, wallet_address: accounts[0] });
            }
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
                const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) {
                    const chainId = await (window as any).ethereum.request({ method: "eth_chainId" });
                    setAccount(accounts[0]);
                    setNetwork(parseInt(chainId, 16));
                }
            }
        };
        checkConnection();
    }, [isMetaMaskInstalled]);

    return {
        account,
        network,
        error,
        loading,
        connect,
        disconnect,
        isMetaMaskInstalled
    };
}
