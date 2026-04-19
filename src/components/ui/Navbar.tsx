import { useEffect, useState } from 'react';
import { db, auth } from '@/src/services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useUser } from '@/src/hooks/useUser';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button } from './Button';
import { LogOut, Moon, Sun } from 'lucide-react';

export const Navbar = () => {
  const { user, setUser } = useUser();
  const { address } = useAccount();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const [error, setError] = useState<string | null>(null);

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

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isMetaMaskInstalled()) {
        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      await switchToHelaTestnet();
      setAccount(accounts[0]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkConnection();

    if ((window as any).ethereum) {
      const handleAccounts = (accounts: string[]) => setAccount(accounts[0] || null);
      const handleChain = () => window.location.reload();

      (window as any).ethereum.on('accountsChanged', handleAccounts);
      (window as any).ethereum.on('chainChanged', handleChain);

      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccounts);
        (window as any).ethereum.removeListener('chainChanged', handleChain);
      };
    }
  }, []);

  useEffect(() => {
    const activeAddress = account || address;
    if (activeAddress && user && user.wallet_address !== activeAddress) {
      const userDocRef = doc(db, 'users', user.id);
      updateDoc(userDocRef, { wallet_address: activeAddress }).then(() => {
        setUser({ ...user, wallet_address: activeAddress });
      });
    }
  }, [account, address, user, setUser]);

  const handleSignOut = () => signOut(auth);

  return (
    <header className="h-[72px] bg-brand-sidebar border-bottom border-brand-border flex items-center justify-between px-8 shrink-0 border-b relative z-50">
      <div>
        <h1 className="text-lg font-bold text-brand-ink">Welcome back, Explorer</h1>
        <p className="text-xs text-brand-text-muted mt-0.5">
          {user ? `You've earned ${user.xp} XP so far.` : 'Join the quest to master Web3.'}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Button variant="ghost" size="sm" onClick={toggleDark} className="w-8 h-8 p-0 rounded-full text-brand-text-muted hover:text-brand-ink">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-brand-bg px-3 py-1.5 rounded-full text-xs font-bold font-mono border border-brand-border">
            <span className="text-brand-accent">🔥</span>
            <span className="text-brand-ink">{user?.streak || 0} STREAK</span>
          </div>
          <div className="flex items-center gap-2 bg-brand-bg px-3 py-1.5 rounded-full text-xs font-bold font-mono border border-brand-border">
            <span>✨</span>
            <span className="text-brand-ink">{user?.xp || 0} XP</span>
          </div>
        </div>

        <div className="flex items-center gap-4 pl-6 border-l border-brand-border">
          {error && <span className="text-[10px] text-red-500 max-w-[120px] truncate" title={error}>{error}</span>}
          {account ? (
            <div className="flex items-center gap-3 bg-brand-bg px-4 py-2 rounded-xl border border-brand-border shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-brand-accent uppercase leading-none">Hela Testnet</span>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={connectWallet}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-lg shadow-indigo-100/50"
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-8 h-8 p-0 border border-brand-border rounded-full hover:bg-brand-bg text-brand-text-muted hover:text-brand-ink">
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => window.location.href = '/login'}>Sign In</Button>
          )}
        </div>
      </div>
    </header>
  );
};

