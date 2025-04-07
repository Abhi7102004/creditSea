import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GetAllLoans, ApproveLoan } from '../urls/loanRoutes';
import { useDispatch } from 'react-redux';
import { setLoans } from '../store/slices/loanSlice';

const AdminDashboard = () => {
  const [allLoans, setAllLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const dispatch = useDispatch();

  // Fetch all loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(GetAllLoans, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setAllLoans(response.data);
        dispatch(setLoans(response.data));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch loans');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchLoans();
  }, [dispatch]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Approve loan function
  const handleApproveLoan = async (applicationId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      // Format approval URL correctly
      const approveUrl = ApproveLoan.replace(':applicationId', applicationId);
      
      await axios.post(
        approveUrl,
        { action: 'approve' }, // Include the action parameter
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh loans after approval
      const response = await axios.get(GetAllLoans, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setAllLoans(response.data);
      dispatch(setLoans(response.data));
      setActionLoading(false);
    } catch (err) {
      console.error('Approval error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to approve loan';
      setError(errorMessage);
      setActionLoading(false);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  // Reject loan function
  const handleRejectLoan = async () => {
    if (!selectedLoanId) return;
    
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      // Format reject URL correctly
      const rejectUrl = ApproveLoan.replace(':applicationId', selectedLoanId);
      
      await axios.post(
        rejectUrl,
        { 
          action: 'reject',
          rejectionReason: rejectionReason
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh loans after rejection
      const response = await axios.get(GetAllLoans, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setAllLoans(response.data);
      dispatch(setLoans(response.data));
      setActionLoading(false);
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedLoanId(null);
    } catch (err) {
      console.error('Rejection error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to reject loan';
      setError(errorMessage);
      setActionLoading(false);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  // Open rejection modal
  const openRejectModal = (loanId) => {
    setSelectedLoanId(loanId);
    setShowRejectModal(true);
  };

  // Filter loans based on search term
  const filteredLoans = allLoans.filter(loan => 
    loan.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.amount?.toString().includes(searchTerm)
  );

  // Stats for admin dashboard
  const stats = {
    total: allLoans.length,
    pending: allLoans.filter(loan => loan.status === 'pending').length,
    verified: allLoans.filter(loan => loan.status === 'verified').length,
    approved: allLoans.filter(loan => loan.status === 'approved').length,
    rejected: allLoans.filter(loan => loan.status === 'rejected').length,
    totalApproved: allLoans
      .filter(loan => loan.status === 'approved')
      .reduce((sum, loan) => sum + loan.amount, 0)
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Admin Actions */}
        <div className="mb-6 flex space-x-3">
          <Link 
            to="/admin/create-admin" 
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
          >
            Create New Admin
          </Link>
          <Link 
            to="/admin/create-verifier" 
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600"
          >
            Create New Verifier
          </Link>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-md shadow-sm p-4">
            <div className="text-xs text-gray-500">TOTAL LOANS</div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="mt-2 text-xs flex justify-between">
              <span className="text-yellow-500">Pending: {stats.pending}</span>
              <span className="text-blue-500">Verified: {stats.verified}</span>
            </div>
            <div className="mt-1 text-xs flex justify-between">
              <span className="text-green-500">Approved: {stats.approved}</span>
              <span className="text-red-500">Rejected: {stats.rejected}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm p-4">
            <div className="text-xs text-gray-500">APPROVED AMOUNT</div>
            <div className="text-2xl font-bold">₦ {stats.totalApproved.toLocaleString()}</div>
            <div className="mt-2 text-xs text-gray-500">
              Total loans approved and disbursed
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm p-4">
            <div className="text-xs text-gray-500">PENDING APPROVALS</div>
            <div className="text-2xl font-bold">{stats.verified}</div>
            <div className="mt-2 text-xs text-gray-500">
              Loans verified and awaiting approval
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for loans by purpose, status, or amount" 
              className="w-full px-10 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Loan Applications Table */}
        <div className="bg-white rounded-md shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Loan Applications</h2>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
          
          {loading ? (
            <div className="text-center py-4">Loading loans...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
                    <th className="py-3 px-2">User ID</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Term</th>
                    <th className="py-3 px-2">Purpose</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.length > 0 ? (
                    filteredLoans.map(loan => (
                      <tr key={loan._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2 text-xs">{loan.userId?.toString().substring(0, 8) || 'N/A'}</td>
                        <td className="py-3 px-2">₦ {loan.amount?.toLocaleString() || 0}</td>
                        <td className="py-3 px-2">{loan.term || 0} months</td>
                        <td className="py-3 px-2">{loan.purpose || 'N/A'}</td>
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
                        <td className="py-3 px-2">
                          <div className="flex space-x-2">
                            {loan.status === 'verified' && (
                              <>
                                <button 
                                  onClick={() => handleApproveLoan(loan._id)}
                                  disabled={actionLoading}
                                  className="bg-green-500 text-white px-3 py-1 rounded-md text-xs hover:bg-green-600 disabled:opacity-50"
                                >
                                  {actionLoading ? 'Processing...' : 'Approve'}
                                </button>
                                <button 
                                  onClick={() => openRejectModal(loan._id)}
                                  disabled={actionLoading}
                                  className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-xs hover:bg-gray-300">
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-4 text-center text-gray-500">
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

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Reject Loan Application</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Please provide a reason for rejecting this loan application..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectLoan}
                disabled={!rejectionReason.trim() || actionLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Reject Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;