import { Request, Response } from 'express';
import LoanApplication, { ApplicationStatus } from '../models/Loans';
import mongoose from 'mongoose';
import { UserRole } from '../models/User';
export const createLoanApplication = async (req: Request, res: Response) => {
  try {
    const { amount, term, purpose } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    // console.log('User ID:', req.user?.id);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (userRole !== UserRole.USER) {
      return res.status(403).json({ message: 'Only users can create loan applications' });
    }
    const application = new LoanApplication({
      userId: new mongoose.Types.ObjectId(userId),
      amount,
      term,
      purpose,
      status: ApplicationStatus.PENDING
    });

    await application.save();
    
    res.status(201).json({
      message: 'Loan application created successfully',
      application
    });
  } catch (error) {
    console.error('Create loan application error:', error);
    res.status(500).json({ message: 'Server error while creating loan application' });
  }
};

export const verifyApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { action, rejectionReason } = req.body;
    const verifierId = req.user?.id;
    if (!verifierId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userRole = req.user?.role;

    if(userRole !== UserRole.VERIFIER) { 
        return res.status(403).json({ message: 'Only verifiers can verify applications' });
    }

    const actionTypes = ['verify', 'reject'];
    if (!actionTypes.includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    if (action === 'reject' && !rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    if (action === 'verify' && rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason should not be provided for verification' });
    }

    const application = await LoanApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== ApplicationStatus.PENDING) {
      return res.status(400).json({ message: 'Application is not in pending status' });
    }

    if (action === 'verify') {
      application.status = ApplicationStatus.VERIFIED;
      application.verifiedBy = new mongoose.Types.ObjectId(verifierId);
      application.verificationDate = new Date();
    } else if (action === 'reject') {
      application.status = ApplicationStatus.REJECTED;
      application.verifiedBy = new mongoose.Types.ObjectId(verifierId);
      application.verificationDate = new Date();
      application.rejectionReason = rejectionReason;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await application.save();

    res.status(200).json({
      message: `Application ${action === 'verify' ? 'verified' : 'rejected'} successfully`,
      application
    });
  } catch (error) {
    console.error('Verify application error:', error);
    res.status(500).json({ message: 'Server error while verifying application' });
  }
};

export const approveApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { action, rejectionReason } = req.body;
    const adminId = req.user?.id;
    if (!adminId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    const userRole =req.user?.role;

    if(userRole!== UserRole.ADMIN) {
        return res.status(403).json({ message: 'Only admins can approve applications' });
    }
    const actionTypes = ['approve', 'reject'];
    if (!actionTypes.includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    // console.log('Action:', action);
    const application = await LoanApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== ApplicationStatus.VERIFIED) {
      return res.status(400).json({ message: 'Application must be verified before approval' });
    }

    if (action === 'approve') {
      application.status = ApplicationStatus.APPROVED;
      application.approvedBy = new mongoose.Types.ObjectId(adminId);
      application.approvalDate = new Date();
    } else if (action === 'reject') {
      application.status = ApplicationStatus.REJECTED;
      application.approvedBy = new mongoose.Types.ObjectId(adminId);
      application.approvalDate = new Date();
      application.rejectionReason = rejectionReason;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await application.save();

    res.status(200).json({
      message: `Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      application
    });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({ message: 'Server error while approving application' });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let applications;

    // Admin and Verifier can see all applications
    if (userRole === UserRole.ADMIN || userRole === UserRole.VERIFIER) {
      applications = await LoanApplication.find()
        .populate('userId', 'name email')
        .populate('verifiedBy', 'name')
        .populate('approvedBy', 'name');
    } else {
      // Regular users can only see their own applications
      applications = await LoanApplication.find({ userId: new mongoose.Types.ObjectId(userId) })
        .populate('verifiedBy', 'name')
        .populate('approvedBy', 'name');
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
};