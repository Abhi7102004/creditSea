import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GetAllLoans } from '../urls/loanRoutes';
import { useDispatch } from 'react-redux';
import { setLoans } from '../store/slices/loanSlice';

const UserDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [allLoans, setAllLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(GetAllLoans, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // console.log(response)
        setAllLoans(response.data);
        dispatch(setLoans(response.data));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch loans');
        setLoading(false);
        console.log(err);
      }
    };
    
    fetchLoans();
  }, []);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-md shadow-sm mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-green-500 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">DEPOSIT</div>
                <div className="text-2xl font-bold">₦ {balance.toFixed(1)}</div>
              </div>
            </div>
            
            <Link to="/apply-loan" className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 transition">
              Get A Loan
            </Link>
          </div>
          
          <div className="flex mt-4 border-t">
            <button className="flex-1 py-3 text-center border-b-2 border-green-500 text-green-500 font-medium">
              Borrow Cash
            </button>
            <button className="flex-1 py-3 text-center text-gray-500">
              Transact
            </button>
            <button className="flex-1 py-3 text-center text-gray-500">
              Deposit Cash
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for loans" 
              className="w-full px-10 py-2 border border-gray-300 rounded-md"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-md shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Applied Loans</h2>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-4">Loading loans...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Term</th>
                    <th className="py-3 px-2">Purpose</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {allLoans.length > 0 ? (
                    allLoans.map(loan => (
                      <tr key={loan._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">₦ {loan.amount.toLocaleString()}</td>
                        <td className="py-3 px-2">{loan.term} months</td>
                        <td className="py-3 px-2">{loan.purpose}</td>
                        <td className="py-3 px-2">
                          {loan.status === 'pending' && (
                            <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                              Pending
                            </span>
                          )}
                          {loan.status === 'verified' && (
                            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                              Verified
                            </span>
                          )}
                          {loan.status === 'approved' && (
                            <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                              Approved
                            </span>
                          )}
                          {loan.status === 'rejected' && (
                            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          {loan.status === 'verified' && formatDate(loan.verificationDate)}
                          {loan.status === 'approved' && formatDate(loan.approvalDate)}
                          {loan.status === 'rejected' && formatDate(loan.rejectionDate)}
                          {loan.status === 'pending' && formatDate(loan.createdAt)}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-gray-500">
                        No loan applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;