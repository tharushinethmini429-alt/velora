import { useEffect, useState } from "react";

import {
    UserRound,
    ShieldCheck,
    Save,
    LockKeyhole,
    Mail,
    User,
} from "lucide-react";

import AdminLayout from "../layouts/AdminLayout";

function AdminSettings() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const token = sessionStorage.getItem("velora_admin_token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/admin/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load profile");
                }

                setName(data.admin.name);
                setEmail(data.admin.email);
            } catch (error) {
                setProfileMessage(
                    error instanceof Error
                        ? error.message
                        : "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleProfileUpdate = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        console.log("Password form submitted");
        setSaving(true);
        setProfileMessage("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name, email }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Profile update failed");
            }

            setName(data.admin.name);
            setEmail(data.admin.email);
            setProfileMessage("Profile updated successfully!");
        } catch (error) {
            setProfileMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setChangingPassword(true);
        setPasswordMessage("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                        confirmPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Password change failed");
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordMessage("Password changed successfully!");
        } catch (error) {
            setPasswordMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <AdminLayout>
            <main className="flex-1 p-6 md:p-10 bg-[#F8F5F0] min-h-screen">
                <div className="max-w-5xl mx-auto">

                    <div className="mb-10">
                        <p className="text-sm text-[#9A8574] mb-2">Administration / Store Management</p>
                        <h1 className="text-3xl font-serif text-[#302721]">Admin Settings</h1>
                        <p className="text-[#81766C] mt-2">Manage your account and security preferences.</p>
                    </div>

                    {loading ? (
                        <p className="text-[#81766C]">Loading settings...</p>
                    ) : (
                        <div className="space-y-8">

                            {/* ADMIN PROFILE */}
                            <section className="bg-white rounded-xl border border-[#EDE5DB] p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-7">
                                    <div className="p-3 bg-[#F0EBE5] rounded-lg">
                                        <UserRound className="text-[#80664F]" size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-serif text-[#302721]">Admin Profile</h2>
                                        <p className="text-sm text-[#81766C]">Update your administrator information.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-[#51443A] mb-2">Admin Name</label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-3 top-3.5 text-[#9A8574]" />
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                            className="w-full border border-[#E5DCD1] rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#9A7859]"/>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#51443A] mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-3.5 text-[#9A8574]" />
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                            className="w-full border border-[#E5DCD1] rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#9A7859]"/>
                                        </div>
                                    </div>

                                    {profileMessage && (
                                        <p className="text-sm text-[#80664F]">{profileMessage}</p>
                                    )}

                                    <button type="submit" disabled={saving}
                                    className="flex items-center gap-2 bg-[#302721] text-white px-6 py-3 rounded-lg hover:bg-[#51443A] disabled:opacity-50">
                                    <Save size={17} />
                                    {saving ? "Saving..." : "Save Profile"}
                                    </button>
                                </form>
                            </section>

                            {/* SECURITY */}
                            <section className="bg-white rounded-xl border border-[#EDE5DB] p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-7">
                                    <div className="p-3 bg-[#F0EBE5] rounded-lg">
                                        <ShieldCheck className="text-[#80664F]" size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-serif text-[#302721]">Security</h2>
                                        <p className="text-sm text-[#81766C]">Keep your administrator account secure.</p>
                                    </div>
                                </div>

                                <form onSubmit={handlePasswordChange} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-[#51443A] mb-2">Current Password</label>
                                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                                        className="w-full border border-[#E5DCD1] rounded-lg px-4 py-3 outline-none focus:border-[#9A7859]"
                                        placeholder="Enter current password"/>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#51443A] mb-2">New Password</label>
                                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8}
                                        className="w-full border border-[#E5DCD1] rounded-lg px-4 py-3 outline-none focus:border-[#9A7859]"
                                        placeholder="At least 8 characters"/>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#51443A] mb-2">Confirm New Password</label>
                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8}
                                        className="w-full border border-[#E5DCD1] rounded-lg px-4 py-3 outline-none focus:border-[#9A7859]"
                                        placeholder="Confirm your new password"/>
                                    </div>

                                    {passwordMessage && (
                                        <p className="text-sm text-[#80664F]">{passwordMessage}</p>
                                    )}

                                    <button type="submit" disabled={changingPassword}
                                    className="flex items-center gap-2 bg-[#302721] text-white px-6 py-3 rounded-lg hover:bg-[#51443A] disabled:opacity-50">
                                    <LockKeyhole size={17} />
                                    {changingPassword ? "Updating..." : "Change Password"}
                                    </button>
                                </form>
                            </section>
                        </div>
                    )}
                </div>
            </main>
        </AdminLayout>
    );
}

export default AdminSettings;
