import React from 'react';
import BlockChainBreak from './BlockChainBreak';
import CheckBalance from './CheckBalance';
import CheckHelaConnection from './CheckHelaConnection';
import CheckHelaFaucet from './CheckHelaFaucet';
import InstallMetaMask from './InstallMetaMask';
import SendToSelf from './SendToSelf';
import SendToUs from './SendToUs';
import WalletAddress from './WalletAddress';
import WalletCreateAndConnect from './WalletCreateAndConnect';

export const Web3TaskRegistry: Record<string, React.FC> = {
    'blockchain-integrity': BlockChainBreak,
    'check-balance': CheckBalance,
    'check-hela-connection': CheckHelaConnection,
    'check-hela-faucet': CheckHelaFaucet,
    'install-metamask': InstallMetaMask,
    'send-to-self': SendToSelf,
    'send-to-us': SendToUs,
    'wallet-address': WalletAddress,
    'wallet-create-connect': WalletCreateAndConnect,
};

