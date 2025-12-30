import React, { useState } from 'react';
import axios from 'axios';

const CITIES = [
    'Los Angeles', 'San Diego', 'San Jose', 'Sacramento', 'San Francisco', 'Fresno', 'Long Beach',
    'Oakland', 'Escondido', 'Stockton', 'Fallbrook', 'Glendale', 'Bakersfield', 'Temecula', 'Riverside',
    'Berkeley', 'Pasadena', 'Whittier', 'Irvine', 'San Bernardino', 'Modesto', 'Santa Barbara', 'Anaheim',
    'Santa Monica', 'Inglewood', 'Torrance', 'Burbank', 'Santa Rosa', 'Santa Ana', 'Chula Vista', 'Orange',
    'Garden Grove', 'Van Nuys', 'North Hollywood', 'Rancho Cucamonga', 'Corona', 'Salinas', 'Other'
];

const CONTRACTS = ['Month-to-Month', 'Two Year', 'One Year'];
const PAYMENT_METHODS = ['Bank Withdrawal', 'Credit Card', 'Mailed Check'];

const INITIAL_STATE = {
    // Personal Information
    'Gender': 0,
    'Age': 57,
    'Senior Citizen': 0,
    'Married': 0,
    'Number of Dependents': 1,
    'City': 'Los Angeles', // Kept as default since not in user input, but user input has Lat/Long

    // Location & Demographics
    'Latitude': 33.482243,
    'Longitude': -116.827173,
    'Population': 2433,

    // Account Details
    'Number of Referrals': 0,
    'Tenure in Months': 24,
    'Phone Service': 1,
    'Avg Monthly Long Distance Charges': 34.24,
    'Multiple Lines': 0,
    'Internet Service': 0,
    'Avg Monthly GB Download': 0,

    // Services & Subscriptions
    'Online Security': 0,
    'Online Backup': 0,
    'Device Protection Plan': 0,
    'Premium Tech Support': 0,
    'Streaming TV': 0,
    'Streaming Movies': 0,
    'Streaming Music': 0,
    'Unlimited Data': 0,

    // Billing & Contract
    'Contract': 'Two Year',
    'Paperless Billing': 0,
    'Payment Method': 'Mailed Check',
    'Monthly Charge': 19.75,
    'Total Charges': 498.1,
    'Total Refunds': 0.0,
    'Total Extra Data Charges': 0,
    'Total Long Distance Charges': 821.76,
    'Total Revenue': 1319.86,

    // Customer Value & Satisfaction
    'Satisfaction Score': 3,
    'CLTV': 2639
};

const Section = ({ title, children }) => (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    </div>
);

const InputField = ({ label, name, type = "text", value, onChange, options = [], required = true, placeholder = "" }) => {
    if (type === 'radio') {
        return (
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
                <div className="flex space-x-4">
                    {options.map((opt) => {
                        const optValue = typeof opt === 'object' ? opt.value : opt;
                        const optLabel = typeof opt === 'object' ? opt.label : opt;
                        return (
                            <label key={optValue} className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name={name}
                                    value={optValue}
                                    checked={String(value) === String(optValue)}
                                    onChange={onChange}
                                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                />
                                <span className="ml-2 text-gray-700">{optLabel}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (type === 'select') {
        return (
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border"
                    required={required}
                >
                    {options.map((opt) => {
                        const optValue = typeof opt === 'object' ? opt.value : opt;
                        const optLabel = typeof opt === 'object' ? opt.label : opt;
                        return (
                            <option key={optValue} value={optValue}>{optLabel}</option>
                        );
                    })}
                </select>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="form-input block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border"
                required={required}
                step={type === 'number' ? "any" : undefined}
            />
        </div>
    );
};

export default function ChurnForm() {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        // Convert numeric strings to numbers
        const payload = { ...formData };
        const numericFields = [
            'Age', 'Number of Dependents', 'Latitude', 'Longitude', 'Population',
            'Number of Referrals', 'Tenure in Months', 'Avg Monthly Long Distance Charges',
            'Avg Monthly GB Download', 'Monthly Charge', 'Total Charges', 'Total Refunds',
            'Total Extra Data Charges', 'Total Long Distance Charges', 'Total Revenue',
            'Satisfaction Score', 'CLTV'
        ];

        numericFields.forEach(field => {
            if (payload[field] !== '') {
                payload[field] = Number(payload[field]);
            }
        });

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/predict', payload);
            setResult(response.data);
        } catch (err) {
            console.error("Prediction error:", err);
            setError(err.response?.data?.detail || "An error occurred while fetching the prediction.");
        } finally {
            setLoading(false);
        }
    };

    const binaryOptions = [
        { label: 'No', value: 0 },
        { label: 'Yes', value: 1 }
    ];

    const genderOptions = [
        { label: 'Female', value: 0 },
        { label: 'Male', value: 1 }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Customer Churn Prediction</h1>
                <p className="text-gray-600 mt-2">Enter customer details below to predict churn probability.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <Section title="Personal Information">
                    <InputField label="Gender" name="Gender" type="radio" options={genderOptions} value={formData['Gender']} onChange={handleChange} />
                    <InputField label="Age" name="Age" type="number" value={formData['Age']} onChange={handleChange} />
                    <InputField label="Senior Citizen" name="Senior Citizen" type="radio" options={binaryOptions} value={formData['Senior Citizen']} onChange={handleChange} />
                    <InputField label="Married" name="Married" type="radio" options={binaryOptions} value={formData['Married']} onChange={handleChange} />
                    <InputField label="Number of Dependents" name="Number of Dependents" type="number" value={formData['Number of Dependents']} onChange={handleChange} />
                    <InputField label="City" name="City" type="select" options={CITIES} value={formData['City']} onChange={handleChange} />
                </Section>

                <Section title="Location & Demographics">
                    <InputField label="Latitude" name="Latitude" type="number" value={formData['Latitude']} onChange={handleChange} />
                    <InputField label="Longitude" name="Longitude" type="number" value={formData['Longitude']} onChange={handleChange} />
                    <InputField label="Population" name="Population" type="number" value={formData['Population']} onChange={handleChange} />
                </Section>

                <Section title="Account Details">
                    <InputField label="Number of Referrals" name="Number of Referrals" type="number" value={formData['Number of Referrals']} onChange={handleChange} />
                    <InputField label="Tenure in Months" name="Tenure in Months" type="number" value={formData['Tenure in Months']} onChange={handleChange} />
                    <InputField label="Phone Service" name="Phone Service" type="radio" options={binaryOptions} value={formData['Phone Service']} onChange={handleChange} />
                    <InputField label="Avg Monthly Long Distance Charges" name="Avg Monthly Long Distance Charges" type="number" value={formData['Avg Monthly Long Distance Charges']} onChange={handleChange} />
                    <InputField label="Multiple Lines" name="Multiple Lines" type="radio" options={binaryOptions} value={formData['Multiple Lines']} onChange={handleChange} />
                    <InputField label="Internet Service" name="Internet Service" type="radio" options={binaryOptions} value={formData['Internet Service']} onChange={handleChange} />
                    <InputField label="Avg Monthly GB Download" name="Avg Monthly GB Download" type="number" value={formData['Avg Monthly GB Download']} onChange={handleChange} />
                </Section>

                <Section title="Services & Subscriptions">
                    <InputField label="Online Security" name="Online Security" type="radio" options={binaryOptions} value={formData['Online Security']} onChange={handleChange} />
                    <InputField label="Online Backup" name="Online Backup" type="radio" options={binaryOptions} value={formData['Online Backup']} onChange={handleChange} />
                    <InputField label="Device Protection Plan" name="Device Protection Plan" type="radio" options={binaryOptions} value={formData['Device Protection Plan']} onChange={handleChange} />
                    <InputField label="Premium Tech Support" name="Premium Tech Support" type="radio" options={binaryOptions} value={formData['Premium Tech Support']} onChange={handleChange} />
                    <InputField label="Streaming TV" name="Streaming TV" type="radio" options={binaryOptions} value={formData['Streaming TV']} onChange={handleChange} />
                    <InputField label="Streaming Movies" name="Streaming Movies" type="radio" options={binaryOptions} value={formData['Streaming Movies']} onChange={handleChange} />
                    <InputField label="Streaming Music" name="Streaming Music" type="radio" options={binaryOptions} value={formData['Streaming Music']} onChange={handleChange} />
                    <InputField label="Unlimited Data" name="Unlimited Data" type="radio" options={binaryOptions} value={formData['Unlimited Data']} onChange={handleChange} />
                </Section>

                <Section title="Billing & Contract">
                    <InputField label="Contract" name="Contract" type="select" options={CONTRACTS} value={formData['Contract']} onChange={handleChange} />
                    <InputField label="Paperless Billing" name="Paperless Billing" type="radio" options={binaryOptions} value={formData['Paperless Billing']} onChange={handleChange} />
                    <InputField label="Payment Method" name="Payment Method" type="select" options={PAYMENT_METHODS} value={formData['Payment Method']} onChange={handleChange} />
                    <InputField label="Monthly Charge" name="Monthly Charge" type="number" value={formData['Monthly Charge']} onChange={handleChange} />
                    <InputField label="Total Charges" name="Total Charges" type="number" value={formData['Total Charges']} onChange={handleChange} />
                    <InputField label="Total Refunds" name="Total Refunds" type="number" value={formData['Total Refunds']} onChange={handleChange} />
                    <InputField label="Total Extra Data Charges" name="Total Extra Data Charges" type="number" value={formData['Total Extra Data Charges']} onChange={handleChange} />
                    <InputField label="Total Long Distance Charges" name="Total Long Distance Charges" type="number" value={formData['Total Long Distance Charges']} onChange={handleChange} />
                    <InputField label="Total Revenue" name="Total Revenue" type="number" value={formData['Total Revenue']} onChange={handleChange} />
                </Section>

                <Section title="Customer Value & Satisfaction">
                    <InputField label="Satisfaction Score" name="Satisfaction Score" type="number" value={formData['Satisfaction Score']} onChange={handleChange} min="1" max="5" />
                    <InputField label="CLTV" name="CLTV" type="number" value={formData['CLTV']} onChange={handleChange} />
                </Section>

                <div className="flex justify-center mt-8 mb-12">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Predicting...
                            </span>
                        ) : 'Predict Churn'}
                    </button>
                </div>
            </form>

            {result && (
                <div className={`mt-8 p-6 rounded-lg shadow-lg text-center ${result.churn_prediction === 'Yes' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                    <h2 className={`text-2xl font-bold mb-2 ${result.churn_prediction === 'Yes' ? 'text-red-700' : 'text-green-700'}`}>
                        Churn Prediction: {result.churn_prediction}
                    </h2>
                    <p className="text-gray-700 text-lg">
                        Probability: <span className="font-semibold">{(result.churn_probability * 100).toFixed(2)}%</span>
                    </p>
                </div>
            )}

            {error && (
                <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg text-center text-red-700">
                    <h3 className="text-lg font-bold mb-2">Error</h3>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}
