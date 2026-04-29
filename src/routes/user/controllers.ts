import axios from 'axios';
import { Request, Response } from 'express';
import admin from '../../firebase';
import User from '../../models/User';

// 🟢 REGISTER
const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, lastName, role } = req.body;
    const now = new Date();

    // ✅ Validación básica
    if (!email || !password || !name || !lastName) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // ❌ bloquear creación de superadmin desde API
    if (role === "superadmin") {
      return res.status(403).json({
        message: "Not allowed to create superadmin"
      });
    }

    // ✅ Verificar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 🔐 Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // 💾 Mongo
    const user = new User({
      name,
      lastName,
      email,
      firebaseUid: userRecord.uid,
      role: role === "admin" ? "admin" : "seller", // ✅ coma agregada

      plan: "free",
      subscriptionStart: now,
      subscriptionEnd: new Date(now.setMonth(now.getMonth() + 3))
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Error while registering user",
      error: error.message
    });
  }
};

//Obtener el Usuarios//
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password"); // 🔥 seguridad
    res.json(users);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message
    });
  }
};

// ✅ AHORA VA AFUERA (IMPORTANTE)
export const paySubscription = async (req: any, res: Response) => {
  try {
    const { paymentMethod } = req.body;

    const user = await User.findById(req.dbUser._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method is required"
      });
    }

    const basePrice = 3000;
    let finalPrice = basePrice;
    let paymentFee = 0;
    let qrCode = null;

    // 💳 MONCASH → +5% + QR
    if (paymentMethod === "moncash") {
      paymentFee = basePrice * 0.05;
      finalPrice += paymentFee;

      // 🔥 generar QR único (SIMULADO)
      qrCode = `QR-${user._id}-${Date.now()}`;
    }

    // 📅 renovar suscripción
    const now = new Date();

    user.plan = "basic";
    user.subscriptionStart = now;
    user.subscriptionEnd = new Date(now.setMonth(now.getMonth() + 1));

    // 👉 opcional: guardar QR en DB
    if (qrCode) {
      user.lastPaymentQR = qrCode; // ⚠️ necesitas este campo en el modelo
    }

    await user.save();

    res.json({
      message: "Subscription renewed",
      paymentMethod,
      basePrice,
      paymentFee,
      totalPaid: finalPrice,
      qrCode // 👈 devolvés el QR al frontend
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Error updating subscription",
      error: error.message
    });
  }
};

export const createSubscriptionPayment = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.dbUser._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const basePrice = 3000;
    const paymentFee = basePrice * 0.05;
    const total = basePrice + paymentFee;

    // 🔥 simulación QR (después podés integrar real)
    const qrData = `moncash://pay?amount=${total}&user=${user._id}`;

    res.json({
      paymentMethod: "moncash",
      basePrice,
      paymentFee,
      total,
      qr: qrData // 👈 ESTE ES TU QR
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Error creating payment",
      error: error.message
    });
  }
};

// 🔐 LOGIN
const loginWithEmailPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const apiKey = process.env.FIREBASE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: "Firebase API key not configured"
      });
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true
    });

    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(404).json({
        message: "User not found in database"
      });
    }

    if (!dbUser.isActive) {
      return res.status(403).json({
        message: "User is disabled"
      });
    }

    res.json({
      message: "Login successful",
      idToken: response.data.idToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      localId: response.data.localId,
      user: {
        _id: dbUser._id,
        email: dbUser.email,
        role: dbUser.role
      }
    });

  } catch (error: any) {
    res.status(401).json({
      message: 'Login failed',
      error: error.response?.data || error.message
    });
  }
};

// 🔄 ACTIVAR / DESACTIVAR USUARIO
export const toggleUserStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user._id.toString() === req.dbUser._id.toString()) {
      return res.status(400).json({
        message: "You cannot deactivate yourself"
      });
    }

    if (user.role === "superadmin") {
      const count = await User.countDocuments({
        role: "superadmin",
        isActive: true
      });

      if (count <= 1) {
        return res.status(400).json({
          message: "Cannot deactivate the last superadmin"
        });
      }
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"}`,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
};

export default {
  registerUser,
  loginWithEmailPassword
};