import React, { useState } from 'react';
import './style/CampaignForm.css';

const CampaignForm = ({ onCreateCampaign, id, donationWallet }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target: 0,
        deadline: '',
        donationWallet: '',
        image: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'deadline') {
            const currentDate = new Date();
            const selectedDate = new Date(value + 'T00:00');

            if (selectedDate >= currentDate) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: value,
                }));
            } else {
                console.error('Invalid deadline. Please select a future date.');
            }
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Buat kampanye tanpa campaign_id di sini, karena itu akan ditetapkan oleh smart contract
        const newCampaign = {
            title: formData.title,
            description: formData.description,
            target: formData.target,
            deadline: formData.deadline,
            donationWallet: formData.donationWallet, // Pastikan nilai donationWallet terisi dengan benar
            image: formData.image,
        };

        onCreateCampaign(newCampaign);

        // Reset formulir setelah kampanye dibuat
        setFormData({
            title: '',
            description: '',
            target: 0,
            deadline: '',
            donationWallet: '',
            image: '',
        });
    };


    return (
        <div id={id} className="campaign-form-container">
            <h2>Create a Campaign</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Target:
                    <input
                        type="number"
                        name="target"
                        value={formData.target}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Deadline:
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                    />
                </label>
                <br/>
                <label>
                    Donation Wallet:
                    <input
                        type="text"
                        name="donationWallet"
                        value={formData.donationWallet}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Image URL:
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button type="submit">Create Campaign</button>
            </form>

        </div>
    );
};

export default CampaignForm;
