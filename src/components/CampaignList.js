import React from 'react';
import './style/CampaignList.css';

const CampaignList = ({ campaigns, onSelectCampaign, id }) => {

    return (
        <div id={id} className="campaign-list-container">
            <h2>Campaign List</h2>
            <ul>
                {campaigns.map((campaign) => (
                    <li key={campaign.campaign_id}>
                        <strong>{campaign.title}</strong>
                        <p>Target: {campaign.target} ETH</p>
                        {/* Tambahkan properti donationWallet */}
                        <p>Wallet: {campaign.owner}</p>
                        <p>Donated: {campaign.amountCollected || 0} ETH</p>
                        <p>Deadline: {formatDate(campaign.deadline)}</p>
                        {/* Tambahkan tombol untuk memilih kampanye */}
                        <button onClick={() => onSelectCampaign(campaign.campaign_id)}>
                            Select Campaign
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export default CampaignList;

