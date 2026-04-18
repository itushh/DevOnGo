import { useState } from "react";

type Status =
  | "checking"
  | "no_metamask"
  | "no_account"
  | "wallet_exists"
  | "connected";

const WalletCreateAndConnect = () => {
  const [status, setStatus] = useState<Status>("checking");
  const [address, setAddress] = useState<string | null>(null);

  // Silent check (no popup)
  const checkWallet = async () => {
    const ethereum = (window as any).ethereum;

    if (!ethereum || !ethereum.isMetaMask) {
      setStatus("no_metamask");
      return;
    }

    const accounts = await ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      setAddress(accounts[0]);
      setStatus("wallet_exists");
    } else {
      setStatus("no_account");
    }
  };

  // Connect wallet (popup)
  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    setAddress(accounts[0]);
    setStatus("connected");
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-lg font-semibold mb-2">
        Wallet Status Check
      </h2>

      <button
        onClick={checkWallet}
        className="px-4 py-2 bg-gray-700 text-white rounded-md mr-2"
      >
        Check Wallet
      </button>

      {status === "no_account" && (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-700 text-white rounded-md"
        >
          Connect Wallet
        </button>
      )}

      <div className="mt-3">
        {status === "checking" && <p>Click to check wallet</p>}
        {status === "no_metamask" && <p>MetaMask not installed ❌</p>}
        {status === "no_account" && <p>No wallet detected. Please create/connect ⚠️</p>}
        {status === "wallet_exists" && (
          <p className="text-green-600">
            Wallet already exists ✅ ({address})
          </p>
        )}
        {status === "connected" && (
          <p className="text-green-600">
            Wallet connected successfully ✅ ({address})
          </p>
        )}
      </div>
    </div>
  );
};

export default WalletCreateAndConnect;

