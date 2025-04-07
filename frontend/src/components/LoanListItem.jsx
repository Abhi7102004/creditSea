import React from 'react';

const LoanListItem = ({ loan, onAction, userRole }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-2">
        <div className="flex items-center space-x-2">
          <img src={loan.avatar || '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full" />
          <div>
            <div className="font-medium">{loan.name}</div>
            <div className="text-xs text-gray-500">Updated {loan.updatedTime} ago</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-2">{loan.amount?.toLocaleString() || loan.phone}</td>
      <td className="py-3 px-2">{loan.date}</td>
      <td className="py-3 px-2">
        {loan.status === 'pending' && userRole === 'verifier' && (
          <button
            onClick={() => onAction?.(loan.id, 'verify')}
            className="bg-yellow-500 text-white px-4 py-1 rounded-full text-xs font-medium"
          >
            Verify
          </button>
        )}
        {loan.status === 'verified' && userRole === 'admin' && (
          <button
            onClick={() => onAction?.(loan.id, 'approve')}
            className="bg-yellow-500 text-white px-4 py-1 rounded-full text-xs font-medium"
          >
            Approve
          </button>
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
        {loan.status === 'verified' && userRole === 'user' && (
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-medium">
            Verified
          </span>
        )}
      </td>
      <td className="py-3 px-2 text-right">
        <button className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default LoanListItem;
