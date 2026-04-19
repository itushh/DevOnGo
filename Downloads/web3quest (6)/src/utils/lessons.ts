export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  web3Task?: {
    type: 'swap' | 'mint' | 'sign' | 'deploy' | 'stake' | 'transfer' | 'blockchain-integrity' | 'check-balance' | 'check-hela-connection' | 'check-hela-faucet' | 'install-metamask' | 'send-to-self' | 'send-to-us' | 'wallet-address' | 'wallet-create-connect';
    title: string;
    description: string;
    steps: string[];
  };
}

export const lessons: Lesson[] = [
  // BASICS PHASE
  {
    id: 'know-web3',
    title: 'Know About Web3',
    description: 'Learn what Web3 is and why wallets + blockchains matter before doing hands-on tasks.',
    content: 'Web3 is a blockchain-powered internet layer where users control addresses and assets. Instead of logging in with a password, you connect a wallet and sign messages to prove you own an address. The blockchain stores balances and app state; the wallet stores keys used to sign.',
    questions: [
      {
        question: 'In Web3, what does a wallet primarily store?',
        options: ['Coins directly', 'Private keys used to sign', 'Your email password', 'A copy of every block'],
        correctIndex: 1,
        explanation: 'Wallets store/manage private keys for signing; the blockchain stores balances and state.'
      },
      {
        question: 'What is the most common “login” action in a dApp?',
        options: ['SMS OTP', 'Connect wallet and sign a message', 'Email confirmation link', 'Face ID only'],
        correctIndex: 1,
        explanation: 'Signing a message proves you control the address without sharing secrets.'
      },
      {
        question: 'What does “decentralized” mean in blockchains?',
        options: ['One company owns all nodes', 'Many nodes share/verify the same ledger', 'No cryptography is used', 'Transactions happen offline'],
        correctIndex: 1,
        explanation: 'Multiple independent nodes validate and store the same ledger, reducing single points of control.'
      }
    ]
  },
  {
    id: 'install-metamask',
    title: 'Install MetaMask',
    description: 'Install the wallet extension you will use to connect, sign, and send transactions.',
    content: 'MetaMask is a browser wallet that manages accounts and connects to networks. Always install from the official source and never share your seed phrase. Pin the extension so it is easy to access during tasks.',
    questions: [
      {
        question: 'Where should you install MetaMask from?',
        options: ['Random websites', 'Official MetaMask listing/website', 'Email attachments', 'Popup “update now” ads'],
        correctIndex: 1,
        explanation: 'Only official sources reduce the risk of fake/malicious extensions.'
      },
      {
        question: 'What should you never share with anyone?',
        options: ['Your public address', 'Your seed phrase', 'A transaction hash', 'Your network name'],
        correctIndex: 1,
        explanation: 'Seed phrase exposure gives full control of the wallet.'
      }
    ],
    web3Task: {
      type: 'install-metamask',
      title: 'InstallMetaMask',
      description: 'Verify whether MetaMask is installed in your browser.',
      steps: ['Install the MetaMask extension', 'Pin MetaMask in your browser toolbar', 'Click “Verify Installation” in the task panel']
    }
  },
  {
    id: 'wallet-create-connect',
    title: 'Create & Connect Wallet',
    description: 'Create a wallet (or use an existing one) and connect it to the app.',
    content: 'Connecting a wallet lets the app read your public address and request message signatures or transactions. Message signing proves ownership and usually costs no gas. Transactions change on-chain state and require gas.',
    questions: [
      {
        question: 'What becomes visible to a dApp after you connect your wallet?',
        options: ['Seed phrase', 'Public address', 'Bank details', 'Device files'],
        correctIndex: 1,
        explanation: 'A dApp can see your public address, but it should never see your seed phrase.'
      },
      {
        question: 'What typically requires gas fees?',
        options: ['Signing a message', 'Sending a transaction', 'Reading an address', 'Copying a tx hash'],
        correctIndex: 1,
        explanation: 'Transactions write to the blockchain and require gas; message signing usually does not.'
      }
    ],
    web3Task: {
      type: 'wallet-create-connect',
      title: 'WalletCreateAndConnect',
      description: 'Check and connect your MetaMask wallet.',
      steps: ['Click “Check Wallet”', 'If needed, click “Connect Wallet”', 'Approve the request in MetaMask']
    }
  },
  {
    id: 'add-custom-network',
    title: 'Add Custom Network (Hela Testnet)',
    description: 'Add/switch to Hela Testnet so you can practice safely using test tokens.',
    content: 'A custom network is defined by values like Chain ID and RPC URL. Always verify these parameters from trusted sources. Switching networks changes which chain your wallet is interacting with.',
    questions: [
      {
        question: 'Why do we use a testnet for practice?',
        options: ['To avoid risking real funds', 'Because it has no rules', 'Because it is always faster', 'Because it cannot fail'],
        correctIndex: 0,
        explanation: 'Testnets use free tokens so you can learn without financial risk.'
      },
      {
        question: 'Which field uniquely identifies a network?',
        options: ['Chain ID', 'Wallet icon color', 'Gas limit', 'Address prefix'],
        correctIndex: 0,
        explanation: 'Chain ID distinguishes networks and prevents replay issues across chains.'
      }
    ],
    web3Task: {
      type: 'check-hela-connection',
      title: 'CheckHElaCOnnection',
      description: 'Verify Hela Testnet can be selected in MetaMask.',
      steps: ['Open MetaMask network selector', 'Add/switch to Hela Testnet', 'Click “Connect Now” to verify']
    }
  },
  {
    id: 'get-test-token',
    title: 'Get Test Tokens',
    description: 'Use the faucet to obtain test HLUSD so you can pay gas and test transfers.',
    content: 'A faucet gives you free testnet tokens. A good learning flow is: check balance, claim from faucet, then verify your balance increased. This confirms your wallet + network are set up correctly.',
    questions: [
      {
        question: 'What is the purpose of a faucet?',
        options: ['To buy tokens with a card', 'To receive free testnet tokens', 'To store seed phrases', 'To speed up the internet'],
        correctIndex: 1,
        explanation: 'Faucets distribute free tokens on testnets for development and learning.'
      },
      {
        question: 'Why check your balance before and after claiming?',
        options: ['To see if tokens were received', 'To reset MetaMask', 'To change your address', 'To increase gas automatically'],
        correctIndex: 0,
        explanation: 'Balance comparison confirms that your claim worked and tokens arrived.'
      }
    ],
    web3Task: {
      type: 'check-hela-faucet',
      title: 'getTestToken',
      description: 'Verify that test tokens were received after claiming from a faucet.',
      steps: ['Check your initial balance', 'Claim tokens from the Hela faucet', 'Click “Verify After Claim” to confirm balance increased']
    }
  },
  {
    id: 'check-balance',
    title: 'Check Balance',
    description: 'Learn how to check your wallet balance and understand what it represents.',
    content: 'Wallet balances are on-chain data. Your wallet app shows balances by querying an RPC provider. Always double-check the network you are on (testnet vs mainnet) because balances are per network.',
    questions: [
      {
        question: 'Is your balance the same on every network?',
        options: ['Yes, balance is global', 'No, balances exist per chain/network', 'Only on weekends', 'Only on testnets'],
        correctIndex: 1,
        explanation: 'An address can exist on multiple networks; each network has its own state and balances.'
      },
      {
        question: 'What does an RPC provider do for your wallet?',
        options: ['Stores your seed phrase', 'Lets you query blockchain data like balances', 'Mints NFTs automatically', 'Pays gas fees'],
        correctIndex: 1,
        explanation: 'RPC endpoints let wallets/dApps read blockchain state and send transactions.'
      }
    ],
    web3Task: {
      type: 'check-balance',
      title: 'CheckBalence',
      description: 'Enter your expected balance and verify it matches what MetaMask reports.',
      steps: ['Open MetaMask and view your balance', 'Enter the same balance into the task', 'Click “Verify Balance”']
    }
  },
  {
    id: 'wallet-address',
    title: 'Wallet Address',
    description: 'Understand what a wallet address is and how to validate it before sending funds.',
    content: 'A wallet address is a public identifier (e.g., starts with 0x on EVM chains). You can share it to receive funds. Always validate addresses and prefer copy/paste or QR codes to avoid mistakes.',
    questions: [
      {
        question: 'What is safe to share publicly?',
        options: ['Seed phrase', 'Private key', 'Public wallet address', 'Recovery words screenshot'],
        correctIndex: 2,
        explanation: 'Public addresses can be shared; secrets like seed phrases must never be shared.'
      },
      {
        question: 'Why should you validate an address before sending?',
        options: ['To increase speed', 'To avoid sending to an invalid/wrong destination', 'To reduce gas to zero', 'To change the token'],
        correctIndex: 1,
        explanation: 'Transactions are irreversible; validation reduces user error.'
      }
    ],
    web3Task: {
      type: 'wallet-address',
      title: 'Wallet address',
      description: 'Enter an address and validate whether it is correctly formatted.',
      steps: ['Copy a wallet address (0x...)', 'Paste it into the task input', 'Click “Verify Address”']
    }
  },

  // DEFI PHASE
  {
    id: 'send-to-us',
    title: 'Send To Us',
    description: 'Practice sending a transaction to a receiver address and verify it on-chain.',
    content: 'A transfer is an on-chain transaction from one address to another. Always verify the receiver address and network before sending. After sending, you can verify the transaction by checking the from/to fields on the blockchain.',
    questions: [
      {
        question: 'What can you use to verify where a transfer was sent?',
        options: ['Seed phrase', 'Transaction hash', 'Wallet theme', 'Browser history'],
        correctIndex: 1,
        explanation: 'A transaction hash lets you fetch details like from/to/value on a block explorer or via RPC.'
      },
      {
        question: 'What happens if you send to the wrong address?',
        options: ['It automatically returns', 'It can be irreversible', 'Support can cancel it', 'It pauses until you confirm later'],
        correctIndex: 1,
        explanation: 'Most blockchain transfers are irreversible once confirmed.'
      }
    ],
    web3Task: {
      type: 'send-to-us',
      title: 'SendToUs',
      description: 'Paste a receiver address and tx hash to verify the transfer was from you to that receiver.',
      steps: ['Send a small test transfer to the receiver address', 'Copy the transaction hash', 'Paste receiver + tx hash into the task and verify']
    }
  },
  {
    id: 'send-to-self',
    title: 'Send To Self',
    description: 'Send a transaction to your own address and verify it using the tx hash.',
    content: 'Self-transfers are useful for practice and verification. The key idea is that the sender and receiver are the same address. This lesson trains you to inspect on-chain transaction fields accurately.',
    questions: [
      {
        question: 'In a self-transfer, which statement is true?',
        options: ['from != to', 'from == to', 'Gas is always zero', 'It cannot be verified'],
        correctIndex: 1,
        explanation: 'A self-transfer has the same sender and receiver address.'
      },
      {
        question: 'What do you need to look up a transaction on-chain?',
        options: ['Transaction hash', 'Seed phrase', 'Email address', 'Password'],
        correctIndex: 0,
        explanation: 'The transaction hash uniquely identifies the transaction.'
      }
    ],
    web3Task: {
      type: 'send-to-self',
      title: 'SendToSelf',
      description: 'Paste a transaction hash and verify it was a self-transfer.',
      steps: ['Send a small amount to your own address', 'Copy the tx hash from MetaMask activity', 'Paste tx hash into the task and verify']
    }
  },

  // NFT PHASE
];
