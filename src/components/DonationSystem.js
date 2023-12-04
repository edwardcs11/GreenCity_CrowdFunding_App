/* global BigInt */
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './style/DonationSystem.css';

const DonationSystem = ({ campaigns, onDonateSuccess }) => {
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [donationAmount, setDonationAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [donationWallet, setDonationWallet] = useState(null); // Tambahkan inisialisasi


    useEffect(() => {
        const loadWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    const accounts = await web3Instance.eth.getAccounts();
                    setWeb3(web3Instance);
                    setAccount(accounts[0]);
                } catch (error) {
                    console.error('Error connecting to MetaMask:', error);
                }
            } else {
                console.error('MetaMask not found');
            }
        };

        loadWeb3();
    }, []);

    useEffect(() => {
        console.log('Selected Campaign (Before):', selectedCampaign);
        if (selectedCampaign !== '') {
            const selectedCampaignId = parseInt(selectedCampaign, 10);
            const selectedCampaignObj = campaigns.find((campaign) => campaign.campaign_id === selectedCampaignId);

            if (selectedCampaignObj) {
                const campaignDonationWallet = selectedCampaignObj.donationWallet;
                const donationWallet = selectedCampaignObj.donationWallet;

                console.log('Selected Campaign Donation Wallet:', campaignDonationWallet);

                if (campaignDonationWallet) {
                    setDonationWallet(campaignDonationWallet);
                } else {
                    console.error('Donation wallet not found for the selected campaign.');
                }
            } else {
                console.error('Selected campaign not found.');
                setDonationWallet(null);
            }
        } else {
            setDonationWallet(null);
        }
        console.log('Selected Campaign (After):', selectedCampaign);
    }, [selectedCampaign, campaigns])

    const handleDonate = async () => {
        try {
            if (!web3 || !account || !selectedCampaign || isNaN(donationAmount)) {
                console.error('Invalid parameters for donation. Please check web3, account, selectedCampaign, and donationAmount.');
                return;
            }

            const campaignAddress = '0xDA0bab807633f07f013f94DD0E6A4F96F8742B53'; // Replace with the correct smart contract address
            const campaignABI = [
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableInvalidOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableUnauthorizedAccount",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "string",
                            "name": "campaign_id",
                            "type": "string"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "donatur",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "DonationReceived",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_admin",
                            "type": "address"
                        }
                    ],
                    "name": "addAdmin",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "campaign_list",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "name": "campaign_list_index",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "name": "campaigns",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "campaign_id",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "target",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountCollected",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "image",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_campaign_id",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "_owner",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "_title",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_target",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_deadline",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "_image",
                            "type": "string"
                        }
                    ],
                    "name": "createCampaign",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_campaign_id",
                            "type": "string"
                        }
                    ],
                    "name": "deleteCampaign",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_campaign_id",
                            "type": "string"
                        }
                    ],
                    "name": "donate",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "donation_history",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "donatur",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "campaign_id",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "date",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "donation_total",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "donations",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "donatur",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "campaign_id",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "date",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "donatur_balance",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "donatur_list",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getCampaignIdList",
                    "outputs": [
                        {
                            "internalType": "string[]",
                            "name": "",
                            "type": "string[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_campaign_id",
                            "type": "string"
                        }
                    ],
                    "name": "getCampaignInfo",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "string",
                                    "name": "campaign_id",
                                    "type": "string"
                                },
                                {
                                    "internalType": "address",
                                    "name": "owner",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "title",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "description",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "target",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amountCollected",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "string",
                                    "name": "image",
                                    "type": "string"
                                },
                                {
                                    "internalType": "address[]",
                                    "name": "donators",
                                    "type": "address[]"
                                },
                                {
                                    "internalType": "uint256[]",
                                    "name": "donations",
                                    "type": "uint256[]"
                                }
                            ],
                            "internalType": "struct Crowdfunding.Campaign",
                            "name": "campaign",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getCampaigns",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "string",
                                    "name": "campaign_id",
                                    "type": "string"
                                },
                                {
                                    "internalType": "address",
                                    "name": "owner",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "title",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "description",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "target",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amountCollected",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "string",
                                    "name": "image",
                                    "type": "string"
                                },
                                {
                                    "internalType": "address[]",
                                    "name": "donators",
                                    "type": "address[]"
                                },
                                {
                                    "internalType": "uint256[]",
                                    "name": "donations",
                                    "type": "uint256[]"
                                }
                            ],
                            "internalType": "struct Crowdfunding.Campaign[]",
                            "name": "",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "getCampaignsByOwner",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "string",
                                    "name": "campaign_id",
                                    "type": "string"
                                },
                                {
                                    "internalType": "address",
                                    "name": "owner",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "title",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "description",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "target",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amountCollected",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "string",
                                    "name": "image",
                                    "type": "string"
                                },
                                {
                                    "internalType": "address[]",
                                    "name": "donators",
                                    "type": "address[]"
                                },
                                {
                                    "internalType": "uint256[]",
                                    "name": "donations",
                                    "type": "uint256[]"
                                }
                            ],
                            "internalType": "struct Crowdfunding.Campaign[]",
                            "name": "",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "donatur",
                            "type": "address"
                        }
                    ],
                    "name": "getDonationHistoryByAddress",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "address",
                                    "name": "donatur",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "campaign_id",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "date",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Crowdfunding.Donation[]",
                            "name": "",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getDonationList",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "address",
                                    "name": "donatur",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "campaign_id",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "date",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Crowdfunding.Donation[]",
                            "name": "",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getDonaturList",
                    "outputs": [
                        {
                            "internalType": "address[]",
                            "name": "",
                            "type": "address[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "withdrawer",
                            "type": "address"
                        }
                    ],
                    "name": "getWithdrawHisotyByAddress",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "address",
                                    "name": "withdrawer",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "campaign_id",
                                    "type": "string"
                                },
                                {
                                    "internalType": "address",
                                    "name": "recipient",
                                    "type": "address"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "date",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Crowdfunding.Withdraw[]",
                            "name": "",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getWithdrawList",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "address",
                                    "name": "withdrawer",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "campaign_id",
                                    "type": "string"
                                },
                                {
                                    "internalType": "address",
                                    "name": "recipient",
                                    "type": "address"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "date",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Crowdfunding.Withdraw[]",
                            "name": "",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_campaign_id",
                            "type": "string"
                        }
                    ],
                    "name": "isCampaignExists",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "is_admin",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "numberOfCampaigns",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "name": "owner_campaign_list_index",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "owner_campaigns",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_campaign_id",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_title",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_target",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_deadline",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "_image",
                            "type": "string"
                        }
                    ],
                    "name": "updateCampaign",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_campaign_id",
                            "type": "string"
                        }
                    ],
                    "name": "withdraw",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "withdraw_history",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "withdrawer",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "campaign_id",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "recipient",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "date",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "withdraw_total",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "withdraws",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "withdrawer",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "campaign_id",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "recipient",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "date",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]; // Replace with the correct ABI
            const campaignContract = new web3.eth.Contract(campaignABI, campaignAddress);

            const gasEstimate = await web3.eth.estimateGas({
                to: campaignAddress, // Gunakan alamat smart contract sebagai tujuan
                value: web3.utils.toWei(donationAmount.toString(), 'ether'),
            });

            const gasPrice = await web3.eth.getGasPrice(); // Dapatkan harga gas yang sedang berlaku
            const gasLimit = BigInt(gasEstimate > 30000 ? gasEstimate : 30000);

            await campaignContract.methods.donate(selectedCampaign).send({
                from: account,
                value: web3.utils.toWei(donationAmount.toString(), 'ether'),
                gas: gasLimit.toString(),
                gasPrice: gasPrice, // Tambahkan properti gasPrice
            });

            console.log(`Donated ${donationAmount} ETH to campaign ${selectedCampaign}`);
            onDonateSuccess(selectedCampaign, donationAmount);

            console.log('Donation successful!');
        } catch (error) {
            console.error('Error during donation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="donation-system-container">
            <h2>Donation System</h2>
            <p>Connected Account: {account}</p>
            <label>
                Select Campaign:
                <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                >
                    <option value="">Select Campaign</option>
                    {campaigns.map((campaign) => (
                        <option key={campaign.campaign_id} value={campaign.campaign_id}>
                            {campaign.title}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Donation Amount (ETH):
                <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                />
            </label>
            <button onClick={handleDonate} disabled={!selectedCampaign || !donationAmount || loading}>
                {loading ? 'Donating...' : 'Donate'}
            </button>
        </div>
    );
};

export default DonationSystem;