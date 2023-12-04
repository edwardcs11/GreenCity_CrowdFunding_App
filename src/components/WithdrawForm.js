// src/components/WithdrawForm.js
import React, { useState } from 'react';
import './style/WithdrawForm.css';

const WithdrawForm = ({
                          web3,
                          account,
                          campaigns,
                          onWithdrawSuccess,
                          selectedCampaignForWithdraw,
                          setSelectedCampaignForWithdraw,
                      }) => {
    const handleWithdraw = async () => {
        if (!selectedCampaignForWithdraw) {
            alert('Please select a campaign to withdraw from.');
            return;
        }

        const campaign = campaigns.find(
            (c) => c.campaign_id === selectedCampaignForWithdraw
        );

        if (!campaign) {
            alert('Selected campaign not found.');
            return;
        }

        // Check if the campaign deadline has passed
        const deadlinePassed = campaign.deadline <= Math.floor(Date.now() / 1000);
        if (!deadlinePassed) {
            alert('Cannot withdraw before the campaign deadline.');
            return;
        }

        // Withdraw the entire campaign balance
        try {
            const result = await web3.eth.sendTransaction({
                from: account,
                to: campaign.contract, // Replace with the actual campaign contract address
                value: web3.utils.toWei(campaign.amountCollected.toString(), 'ether'),
            });

            // Handle the success of the withdrawal
            onWithdrawSuccess();
            alert('Withdrawal successful!');
        } catch (error) {
            console.error('Error during withdrawal:', error);
            alert('Error during withdrawal. Please check the console for details.');
        }
    };

    return (
        <form className="withdraw-form">
            <h2>Withdraw from Campaign</h2>
            <label>Select Campaign:</label>
            <select
                value={selectedCampaignForWithdraw}
                onChange={(e) => setSelectedCampaignForWithdraw(e.target.value)}
            >
                <option value="">Select Campaign</option>
                {campaigns.map((campaign) => (
                    <option key={campaign.campaign_id} value={campaign.campaign_id}>
                        {campaign.title}
                    </option>
                ))}
            </select>

            <button onClick={handleWithdraw}>Withdraw</button>
        </form>
    );
};

export default WithdrawForm;
