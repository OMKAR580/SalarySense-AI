"use client";

import React, { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { User, Mail, Camera, Trash2, Key, Save, AlertTriangle } from "lucide-react";
import apiClient, { getStaticUrl } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { username, userEmail, avatar, setUserData, clearAuthSession, updateAvatar } = useAuthStore();
  const safeAvatar = typeof avatar === 'string' && avatar !== 'null' && avatar.trim() !== '' ? getStaticUrl(avatar) : null;

  const [formUsername, setFormUsername] = useState(username || "");
  const [formEmail, setFormEmail] = useState(userEmail || "");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [deletePassword, setDeletePassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayError = (msg: string) => {
    setError(msg);
    setSuccess(null);
    setTimeout(() => setError(null), 5000);
  };
  
  const displaySuccess = (msg: string) => {
    setSuccess(msg);
    setError(null);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await apiClient.put("/profile", { username: formUsername, email: formEmail });
      // Update store
      setUserData(data.email, data.username, avatar, useAuthStore.getState().roles, useAuthStore.getState().permissions);
      displaySuccess("Profile updated successfully! Redirecting...");
      setTimeout(() => {
        router.push("/predict");
      }, 1000);
    } catch (err: any) {
      displayError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      displayError("New passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await apiClient.put("/profile/password", { current_password: currentPassword, new_password: newPassword });
      displaySuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      displayError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const { data } = await apiClient.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      updateAvatar(data.avatar_url);
      displaySuccess("Avatar updated successfully!");
    } catch (err: any) {
      displayError(err.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
      return;
    }
    setLoading(true);
    try {
      await apiClient.delete("/profile", { data: { password: deletePassword } });
      clearAuthSession();
      window.location.href = "/login";
    } catch (err: any) {
      displayError(err.message || "Failed to delete account. Make sure your password is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
        <p className="text-slate-400">Manage your account details and preferences.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
          <Save className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Danger Zone */}
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="bg-[#0b0f19]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-2 border-white/10 overflow-hidden bg-slate-800 flex items-center justify-center">
                {safeAvatar ? (
                  <img src={safeAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-500" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity rounded-full cursor-pointer"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Change</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden" 
              />
            </div>
            <div className="text-center">
              <h3 className="text-white font-medium">{username}</h3>
              <p className="text-slate-400 text-xs">{userEmail}</p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-red-400 font-semibold flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-slate-400 text-xs">
              Permanently delete your account and all of your content.
            </p>
            
            <form onSubmit={handleDeleteAccount} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-medium text-slate-300 ml-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  placeholder="Enter your password (or OAUTH_CONFIRM)"
                  required
                  className="w-full bg-black/20 border border-red-500/30 rounded-lg h-10 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 mt-1"
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !deletePassword}
                className="w-full h-10 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                Delete Account
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Details */}
          <div className="bg-[#0b0f19]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Account Details</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={formUsername}
                      onChange={e => setFormUsername(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg h-10 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" 
                      value={formEmail}
                      onChange={e => setFormEmail(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg h-10 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  disabled={loading || (formUsername === username && formEmail === userEmail)}
                  className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-[#0b0f19]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" />
              Security
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 ml-1">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 ml-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                    className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 ml-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                    className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                  className="h-10 px-6 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
