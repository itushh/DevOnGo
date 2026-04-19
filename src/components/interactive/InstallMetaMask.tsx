import { useState } from "react";

const InstallMetaMask = () => {
    const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");

    const verifyMetaMaskInstallation = () => {
        const isMetaMaskInstalled = typeof (window as any).ethereum !== 'undefined' && (window as any).ethereum.isMetaMask;

        if (isMetaMaskInstalled) {
            setStatus("success");
        } else {
            setStatus("failed");
        }
    }

    return (
        <div className="text-center">
            <div>Install MetaMask</div>
            <button onClick={verifyMetaMaskInstallation} className="px-4 py-2 bg-blue-700 text-white rounded-md">Done</button>
            <p>{status}</p>
        </div>
    )
}

export default InstallMetaMask