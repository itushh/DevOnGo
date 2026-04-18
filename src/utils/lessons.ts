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
    type: 'swap' | 'mint' | 'sign' | 'deploy' | 'stake' | 'transfer';
    title: string;
    description: string;
    steps: string[];
  };
}

export const lessons: Lesson[] = [
  // BASICS PHASE
  {
    id: 'intro-to-web3',
    title: 'What is Web3?',
    description: 'Understand the evolution of the internet.',
    content: 'Web3 is the next generation of the internet, where users have ownership of their data and digital assets through blockchain technology.',
    questions: [
      {
        question: 'What is the primary difference between Web2 and Web3?',
        options: ['Web3 is faster than Web2', 'Web3 is decentralized and user-owned', 'Web2 has no databases', 'Web3 requires a mouse'],
        correctIndex: 1,
        explanation: 'Web3 emphasizes decentralization and user ownership through blockchain.'
      }
    ],
    web3Task: {
      type: 'sign',
      title: 'Initialize Your Identity',
      description: 'Sign a message with your wallet to prove you control your address.',
      steps: [
        'Open your digital wallet extension',
        'Verify the message content: "Welcome to Web3Quest"',
        'Click "Sign" to authorize the message'
      ]
    }
  },
  {
    id: 'wallets-101',
    title: 'Digital Wallets',
    description: 'Learn how to store and manage assets.',
    content: 'A digital wallet stores your private keys, which allow you to authorize transactions and access your assets on the blockchain.',
    questions: [
      {
        question: 'What is stored inside a Web3 wallet?',
        options: ['Physical coins', 'Private keys', 'Credit cards', 'Only your username'],
        correctIndex: 1,
        explanation: 'Wallets store private keys that allow you to sign transactions.'
      }
    ]
  },
  {
    id: 'private-keys-security',
    title: 'Private Keys & Mnemonic Phrases',
    description: 'The root of your security.',
    content: 'Your private key is like your password to the safe. Your mnemonic phrase (seed phrase) is a set of 12-24 words that generates your keys.',
    questions: [
      {
        question: 'Should you ever share your seed phrase?',
        options: ['Yes, with support', 'Only with family', 'Never, with anyone', 'Only if the website looks safe'],
        correctIndex: 2,
        explanation: 'Sharing your seed phrase gives full control of your assets to someone else.'
      }
    ]
  },
  {
    id: 'blockchain-networks',
    title: 'Blockchain Networks',
    description: 'Ethereum, Polygon, and beyond.',
    content: 'Different blockchains exist, each with its own focus (security, speed, cost). Layer 2s solve scaling issues.',
    questions: [
      {
        question: 'What is a Layer 2 network?',
        options: ['A separate internet', 'A scaling solution built on top of a Layer 1', 'A backup hard drive', 'A social media app'],
        correctIndex: 1,
        explanation: 'Layer 2s handle transactions off-chain to reduce cost and increase speed.'
      }
    ]
  },
  {
    id: 'transactions-tx',
    title: 'Transactions & Gas Fees',
    description: 'Moving value on-chain.',
    content: 'Every transaction requires energy and space. Gas fees pay validators to process your transaction.',
    questions: [
      {
        question: 'What is Gas?',
        options: ['Fuel for cars', 'The unit that measures computation effort', 'A type of crypto token', 'A social club'],
        correctIndex: 1,
        explanation: 'Gas refers to the fee required to execute transactions on the Ethereum network.'
      }
    ],
    web3Task: {
      type: 'transfer',
      title: 'Simulate a Transfer',
      description: 'Send test tokens to a virtual recipient.',
      steps: [
        'Enter recipient address',
        'Specify amount (0.1 Test ETH)',
        'Adjust Gas preference (Normal/Fast)',
        'Click "Send"'
      ]
    }
  },

  // DEFI PHASE
  {
    id: 'defi-overview',
    title: 'What is DeFi?',
    description: 'Decentralized Finance explained.',
    content: 'DeFi uses smart contracts to provide financial services like lending and borrowing without banks.',
    questions: [
      {
        question: 'Which is a core feature of DeFi?',
        options: ['Requires an ID', 'No central authority', 'Closed on weekends', 'Paper-based forms'],
        correctIndex: 1,
        explanation: 'DeFi is permissionless and does not rely on central banks.'
      }
    ]
  },
  {
    id: 'tokens-and-swaps',
    title: 'Swapping Tokens',
    description: 'Trading without an exchange.',
    content: 'Decentralized Exchanges (DEXs) allow direct peer-to-peer token trading using Liquidity Pools.',
    questions: [
      {
        question: 'Which standard is used for fungible tokens on Ethereum?',
        options: ['ERC-721', 'ERC-20', 'HTTP', 'TCP/IP'],
        correctIndex: 1,
        explanation: 'ERC-20 is the standard for fungible tokens.'
      }
    ],
    web3Task: {
      type: 'swap',
      title: 'Perform a Swap',
      description: 'Exchange Token A for Token B on a DEX.',
      steps: [
        'Select "Swap" on the DEX interface',
        'Choose "ETH" as input and "USDC" as output',
        'Approve the DEX to spend your ETH',
        'Confirm the Swap transaction'
      ]
    }
  },
  {
    id: 'liquidity-pools',
    title: 'Liquidity Pools',
    description: 'The engine of DeFi.',
    content: 'Liquidity Providers (LPs) deposit tokens into smart contracts to enable trading for others.',
    questions: [
      {
        question: 'How do LPs earn money?',
        options: ['Trading fees paid by users', 'A salary from the bank', 'Selling NFTs', 'They don\'t'],
        correctIndex: 0,
        explanation: 'Liquidity providers earn a portion of the trading fees from the swap pool.'
      }
    ]
  },
  {
    id: 'staking-yield',
    title: 'Staking & Yield',
    description: 'Putting your tokens to work.',
    content: 'Staking involves locking tokens to secure a network or provide liquidity in exchange for rewards.',
    questions: [
      {
        question: 'What is Proof of Stake?',
        options: ['A consensus mechanism using staked assets', 'A type of physical stake', 'A proof of work game', 'A photo filter'],
        correctIndex: 0,
        explanation: 'PoS uses stake instead of mining power to secure the network.'
      }
    ],
    web3Task: {
      type: 'stake',
      title: 'Lock for Rewards',
      description: 'Stake tokens in a secure vault.',
      steps: [
        'Connect your dashboard',
        'Select the "Staking Pool"',
        'Enter amount to lock',
        'Sign the "Lock" transaction'
      ]
    }
  },
  {
    id: 'stablecoins',
    title: 'Stablecoins',
    description: 'Hedge against volatility.',
    content: 'Stablecoins are tokens pegged to an asset like the USD to keep a stable value.',
    questions: [
      {
        question: 'Which is a popular stablecoin?',
        options: ['Bitcoin', 'Ethereum', 'USDT', 'Doge'],
        correctIndex: 2,
        explanation: 'USDT is pegged to the US Dollar.'
      }
    ]
  },

  // NFT PHASE
  {
    id: 'nfts-and-ownership',
    title: 'NFTs & Digital Assets',
    description: 'Unique tokens on the chain.',
    content: 'Non-Fungible Tokens (NFTs) prove ownership of unique items like art or gaming skins.',
    questions: [
      {
        question: 'What makes an NFT different from an ERC-20?',
        options: ['Cheaper', 'Unique and non-interchangeable', 'Only for images', 'No difference'],
        correctIndex: 1,
        explanation: 'Each NFT is unique (ID-based).'
      }
    ],
    web3Task: {
      type: 'mint',
      title: 'Mint a Test Certificate',
      description: 'Create your first digital asset.',
      steps: [
        'Upload your asset data (metadata)',
        'Click "Mint" button',
        'Wait for block confirmation',
        'View your asset in "Inventory"'
      ]
    }
  },
  {
    id: 'nft-marketplaces',
    title: 'Marketplaces',
    description: 'Buying and selling NFTs.',
    content: 'Platforms like OpenSea or Magic Eden allow users to list and trade their unique assets.',
    questions: [
      {
        question: 'What is a "Royalties" in NFTs?',
        options: ['A fee for the king', 'A % of resale value paid to creators', 'A type of crown', 'A login password'],
        correctIndex: 1,
        explanation: 'Creators can earn royalties automatically on every secondary sale.'
      }
    ]
  },
  {
    id: 'smart-contracts-logic',
    title: 'Deeds & Smart Contracts',
    description: 'Programming ownership.',
    content: 'Smart contracts automate the transfer of ownership when conditions are met.',
    questions: [
      {
        question: 'Who executes smart contracts?',
        options: ['Validators/Miners', 'A central server', 'A legal clerk', 'Manual entry'],
        correctIndex: 0,
        explanation: 'Decentralized participants execute and verify contract logic.'
      }
    ]
  },
  {
    id: 'governance-daos',
    title: 'DAOs & Governance',
    description: 'Community-led projects.',
    content: 'Decentralized Autonomous Organizations (DAOs) allow token holders to vote on project decisions.',
    questions: [
      {
        question: 'What is the utility of a Governance Token?',
        options: ['Buying coffee', 'Voting on proposals', 'Changing your profile pic', 'Nothing'],
        correctIndex: 1,
        explanation: 'Governance tokens represent voting power in a system.'
      }
    ]
  },
  {
    id: 'metaverse-identity',
    title: 'Digital Identity',
    description: 'ENS and Avatars.',
    content: 'On-chain identity uses protocols like ENS (.eth) to represent users with readable names.',
    questions: [
      {
        question: 'What does ENS standalone for?',
        options: ['Every Name System', 'Ethereum Name Service', 'Entry Node Secure', 'Easy Network Setup'],
        correctIndex: 1,
        explanation: 'ENS maps complex addresses to human-readable names.'
      }
    ]
  }
];
