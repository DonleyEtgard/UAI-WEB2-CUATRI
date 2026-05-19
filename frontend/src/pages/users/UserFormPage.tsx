import { useState } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { registerUser } from "../../firebase/auth";
import { createOrUpdateUserProfile } from "../../firebase/firestore";
import type { AppUser } from "../../types/firestore";

const initialState: Partial<AppUser> = {
  displayName: "",
  email: "",
  role: "employee",
  organizationId: "",
  isActive: true,
  plan: "free",
};

const UserFormPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState<Partial<AppUser>>(initialState);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ tipado correcto (sin any)
  const handleChange = <K extends keyof Partial<AppUser>>(
    key: K,
    value: Partial<AppUser>[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.displayName || !form.email || !password || !form.role) {
      alert("Please complete required fields");
      return;
    }

    if (!user?.organizationId) {
      alert("You must be part of an organization to create users");
      return;
    }

    try {
      setLoading(true);

      // Create Firebase auth user
      const userCredential = await registerUser(form.email, password);

      // Create Firestore user profile
      const userProfile: AppUser = {
        uid: userCredential.user.uid,
        email: form.email,
        displayName: form.displayName,
        role: form.role,
        organizationId: user.organizationId, // Assign to current user's organization
        isActive: form.isActive ?? true,
        plan: form.plan ?? "free",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createOrUpdateUserProfile(userProfile);

      alert("User created successfully");
      setForm(initialState); // ✅ reset consistente
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card space-y-6">

        {/* HEADER */}
        <div>
          <h1>Create User</h1>
          <p className="text-gray-400 text-sm">
            Add a new user to your system
          </p>
        </div>

        {/* BASIC INFO */}
        <div className="space-y-3">
          <h2>Basic Info</h2>

          <div className="grid grid-cols-2 gap-4">

            <input
              className="col-span-2"
              placeholder="Display Name *"
              value={form.displayName || ""}
              onChange={(e) => handleChange("displayName", e.target.value)}
            />

            <input
              className="col-span-2"
              placeholder="Email *"
              type="email"
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <input
              className="col-span-2"
              placeholder="Password *"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              className="col-span-2"
              value={form.role || ""}
              onChange={(e) => handleChange("role", e.target.value as "admin" | "employee")}
            >
              <option value="">Select role *</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserFormPage;