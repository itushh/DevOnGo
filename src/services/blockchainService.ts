import { ethers } from 'ethers';

export const HELA_TESTNET = {
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

export const CONTRACT_ADDRESS = "0x5a0D0335fDe5081f775F111b55b5439939E258f8";

export const CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "moduleName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "date",
                "type": "uint256"
            }
        ],
        "name": "ModuleMarked",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_username",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_moduleName",
                "type": "string"
            }
        ],
        "name": "markModuleDone",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_username",
                "type": "string"
            }
        ],
        "name": "checkUserProgress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "moduleName",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "date",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct progressContract.Module[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export const getContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

export const markModuleOnBlockchain = async (username: string, moduleName: string) => {
    if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask is not installed");
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    const tx = await contract.markModuleDone(username, moduleName);
    await tx.wait();
    return tx.hash;
};
