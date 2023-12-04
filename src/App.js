// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CampaignList from './components/CampaignList';
import CampaignForm from './components/CampaignForm';
import DonationSystem from './components/DonationSystem';
import About from '../src/components/About';
import WithdrawForm from './components/WithdrawForm'; // Import komponen WithdrawForm
import Web3 from 'web3';
import './App.css';

const generateUniqueId = () => {
    const timestamp = Date.now();
    return `campaign_${timestamp}`;
};

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [campaignDonations, setCampaignDonations] = useState({});
    const [donationWallet, setDonationWallet] = useState('');
    const [selectedCampaignForWithdraw, setSelectedCampaignForWithdraw] = useState(null);

    useEffect(() => {
        const initializeWeb3 = async () => {
            if (window.ethereum) {
                try {
                    const web3Instance = new Web3(window.ethereum);
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const accounts = await web3Instance.eth.getAccounts();
                    setWeb3(web3Instance);
                    setAccount(accounts[0]);
                } catch (error) {
                    console.error('Error connecting to Metamask:', error);
                }
            } else {
                console.error('Metamask or web3 provider not found');
            }
        };

        initializeWeb3();
    }, []); // useEffect akan dijalankan sekali setelah komponen dimuat

    useEffect(() => {
        // Coba muat kampanye dari localStorage
        const storedCampaigns = localStorage.getItem('campaigns');

        // Jika ada data kampanye di localStorage, gunakan itu
        if (storedCampaigns) {
            const parsedCampaigns = JSON.parse(storedCampaigns);
            setCampaigns(parsedCampaigns);

            // Mungkin tambahkan pernyataan berikut untuk memastikan bahwa campaigns telah diperbarui
            console.log('Loaded Campaigns from localStorage:', parsedCampaigns);
        }
    }, []);


    const handleCreateCampaign = (formData) => {
        const uniqueId = generateUniqueId();
        const newCampaign = {
            campaign_id: uniqueId,
            title: formData.title,
        };
        const newCampaigns = [...campaigns, newCampaign];
        setCampaigns(newCampaigns);

        // Simpan data kampanye di localStorage
        localStorage.setItem('campaigns', JSON.stringify(newCampaigns));

        console.log('Creating campaign:', newCampaign);

        // Mungkin tambahkan pernyataan berikut untuk memastikan bahwa campaigns telah diperbarui
        console.log('Updated Campaigns:', newCampaigns);
    };

    const handleDonate = (campaignId, amount) => {
        console.log(`Donating ${amount} to campaign ${campaignId}`);
    };

    const handleWithdraw = (campaignId) => {
        setSelectedCampaignForWithdraw(campaignId);
    };

    const handleWithdrawSuccess = () => {
        setSelectedCampaignForWithdraw(null);
    };

    const handleDonateSuccess = (campaignId, amount) => {
        const updatedCampaignDonations = { ...campaignDonations, [campaignId]: amount };
        setCampaignDonations(updatedCampaignDonations);
    };

    const handleResetCampaignList = () => {
        // Fungsi untuk mereset daftar kampanye
        setCampaigns([]);
        // Hapus kampanye dari penyimpanan lokal
        localStorage.removeItem('campaigns');
    };

    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className="app-container">
                                <CampaignList
                                    id="campaign-list"
                                    campaigns={campaigns}
                                    onSelectCampaign={setSelectedCampaignForWithdraw}
                                />

                                <CampaignForm
                                    id="campaign-form"
                                    onCreateCampaign={handleCreateCampaign}
                                    donationWallet={donationWallet}
                                />
                                <DonationSystem
                                    id="donation-system"
                                    campaigns={campaigns}
                                    onDonate={handleDonate}
                                    onWithdraw={handleWithdraw}
                                    onDonateSuccess={handleDonateSuccess}
                                    donationWallet={donationWallet}
                                />

                                <div>
                                    <button
                                        onClick={handleResetCampaignList}
                                        style={{ backgroundColor: 'red', color: 'white' }}
                                    >
                                        Reset Campaign List
                                    </button>
                                </div>
                            </div>
                        }
                    />
                    <Route
                        path="/withdraw"
                        element={
                            <WithdrawForm
                                web3={window.ethereum}
                                account={account}
                                campaigns={campaigns}
                                onWithdrawSuccess={handleWithdrawSuccess}
                                selectedCampaignForWithdraw={selectedCampaignForWithdraw}
                                setSelectedCampaignForWithdraw={setSelectedCampaignForWithdraw}
                            />
                        }
                    />

                    <Route path="/about" element={<About />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
