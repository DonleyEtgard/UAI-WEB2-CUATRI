import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// Crear usuario (registro)
export const registerUser = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

// Iniciar sesión
export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// Cerrar sesión
export const logoutUser = () => signOut(auth);

// Escuchar cambios de sesión
export const observeAuth = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);
