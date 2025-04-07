import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreateNewLoan } from '../urls/loanRoutes';

const GetALoan = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    amount: '',
    term: '',
    purpose: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' || name === 'term' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(CreateNewLoan, formData,{
        headers: {
            Authorization: `Bearer ${token}`, 
          },
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 2000); // Show success for 2 seconds before redirect
      } else {
        throw new Error('Unexpected response from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting your loan application.');
      console.error('Error submitting loan application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-md shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Apply for a Loan</h1>

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">Your loan application has been submitted successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount (₦)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                min="1000"
                placeholder="Enter loan amount"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Term (months)
              </label>
              <input
                type="number"
                id="term"
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                min="1"
                max="60"
                placeholder="Enter loan term in months"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Purpose
              </label>
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select a purpose</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="personal">Personal</option>
                <option value="medical">Medical</option>
                <option value="home">Home Improvement</option>
                <option value="debt">Debt Consolidation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/user/dashboard')}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Apply for Loan'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-white rounded-md shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Loan Information</h2>
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-bold">Interest Rate:</span> 5% - 15% (based on credit assessment)
            </p>
            <p>
              <span className="font-bold">Processing Fee:</span> 1% of loan amount
            </p>
            <p>
              <span className="font-bold">Disbursement Time:</span> Within 48 hours of approval
            </p>
            <p>
              <span className="font-bold">Repayment Method:</span> Monthly installments via bank transfer or direct debit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetALoan;
