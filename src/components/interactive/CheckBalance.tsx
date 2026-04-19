import { useState } from "react";

const CheckBalance = () => {
    const [status, setStatus] = useState<"success" | "failed" | "pending">("pending");
    const [error, setError] = useState<string | null>(null);

    const checkBalance = async () => {
        setStatus("pending");
        setError(null);

        const input = (document.getElementById("balanceInput") as HTMLInputElement)?.value;

        if (!(window as any).ethereum) {
            setStatus("failed");
            setError("MetaMask not found");
            return;
        }

        if (!input || isNaN(Number(input))) {
            setStatus("failed");
            setError("Invalid input");
            return;
        }

        try {
            const accounts = await (window as any).ethereum.request({
                method: "eth_requestAccounts",
            });

            const balanceHex = await (window as any).ethereum.request({
                method: "eth_getBalance",
                params: [accounts[0], "latest"],
            });

            const balance = parseInt(balanceHex, 16) / 1e18;

            const isCorrect = Math.abs(Number(input) - balance) < 0.0001;

            if (isCorrect) {
                setStatus("success");
            } else {
                setStatus("failed");
                setError(`Incorrect balance. Actual: ${balance}`);
            }
        } catch (err) {
            console.error(err);
            setStatus("failed");
            setError("Error fetching balance");
        }
    };

    return (
        <div>
            <p>Task: Enter your wallet balance</p>

            <input
                id="balanceInput"
                type="text"
                placeholder="Enter balance"
                className="border px-2 py-1"
            />

            <button
                onClick={checkBalance}
                className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
            >
                Verify
            </button>

            <p>{status}</p>

            {status === "failed" && <p className="text-red-500">{error}</p>}
            {status === "success" && (
                <p className="text-green-500">Correct Balance</p>
            )}
        </div>
    );
};

export default CheckBalance;