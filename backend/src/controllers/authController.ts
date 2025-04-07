import e, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserRole, IUser } from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if(!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role: UserRole.USER,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
    try {
      // req.user is added by the authenticate middleware
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Admin privileges required" });
      }
  
      const userId = req.params.id;
  
      // Prevent deleting yourself
      if (req.user.id.toString() === userId) {
        return res
          .status(400)
          .json({ message: "Cannot delete your own account" });
      }
  
      // Find and delete user
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Only admin can see all users
    if (!req.user || req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

export const createAdmins = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: "Admin privileges required" });
    }

    const { email, password, name } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new admin user
    const user = new User({
      name,
      email,
      password,
      role: UserRole.ADMIN,
    });

    await user.save();

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Server error while creating admin" });
  }
};

export const createVerifier = async (req: Request, res: Response) => {
  try {
    // req.user is added by the authenticate middleware
    if (!req.user || req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: "Admin privileges required" });
    }

    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new verifier user
    const user = new User({
      name,
      email,
      password,
      role: UserRole.VERIFIER,
    });

    await user.save();

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create verifier error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
