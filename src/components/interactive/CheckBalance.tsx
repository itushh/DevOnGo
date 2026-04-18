import { useState } from "react";
import { ethers } from "ethers";

const CheckBalance = () => {
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("");

    const HELA_CHAIN_ID = "0xa2c68"; // 666888
    const TOKEN_ADDRESS = "0x28D617d36a02A6367F9ABfF6039C7f1A650Dd0b7";

    const ABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)"
    ];

    const verifyBalance = async () => {
        try {
            if (!(window as any).ethereum) {
                alert("Install MetaMask");
                return;
            }

            const ethereum = (window as any).ethereum;
            const provider = new ethers.BrowserProvider(ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const chainId = await ethereum.request({ method: "eth_chainId" });

            if (chainId !== HELA_CHAIN_ID) {
                alert("Switch to Hela Testnet");
                return;
            }

            const contract = new ethers.Contract(TOKEN_ADDRESS, ABI, provider);

            const decimals = await contract.decimals();
            const balanceRaw = await contract.balanceOf(address);
            const balance = parseFloat(ethers.formatUnits(balanceRaw, decimals));

            const userValue = parseFloat(input);

            if (Math.abs(balance - userValue) < 0.01) {
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
        <div>
            <input
                type="number"
                placeholder="Enter balance"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <button onClick={verifyBalance}>
                Verify
            </button>

            <p>{status}</p>
        </div>
    );
};

export default CheckBalance;