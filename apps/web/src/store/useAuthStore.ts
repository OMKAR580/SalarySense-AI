import { create } from "zustand";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  userEmail: string | null;
  username: string | null;
  avatar: string | null;
  roles: string[];
  permissions: string[];
  setAuthSession: (
    token: string,
    refreshToken: string,
    userId: string,
    email: string,
    username: string,
    avatar?: string | null,
    roles?: string[],
    permissions?: string[]
  ) => void;
  setUserData: (
    email: string,
    username: string,
    avatar: string | null,
    roles: string[],
    permissions: string[]
  ) => void;
  updateTokens: (token: string, refreshToken: string) => void;
  updateAvatar: (avatarUrl: string) => void;
  clearAuthSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Safe SSR load of initial state
  const isClient = typeof window !== "undefined";
  const token = isClient ? localStorage.getItem("auth_token") : null;
  const refreshToken = isClient ? localStorage.getItem("auth_refresh_token") : null;
  const userId = isClient ? localStorage.getItem("auth_user_id") : null;
  const userEmail = isClient ? localStorage.getItem("auth_user_email") : null;
  const username = isClient ? localStorage.getItem("auth_username") : null;
  const avatar = isClient ? localStorage.getItem("auth_avatar") : null;

  // Load roles/permissions safely
  let roles: string[] = [];
  let permissions: string[] = [];
  if (isClient) {
    try {
      const storedRoles = localStorage.getItem("auth_roles");
      const storedPerms = localStorage.getItem("auth_permissions");
      if (storedRoles) roles = JSON.parse(storedRoles);
      if (storedPerms) permissions = JSON.parse(storedPerms);
    } catch {
      // Fallback to empty if parse fails
    }
  }

  return {
    token,
    refreshToken,
    userId,
    userEmail,
    username,
    avatar,
    roles,
    permissions,
    setAuthSession: (token, refreshToken, userId, email, username, avatarUrl = null, rolesList = [], permissionsList = []) => {
      if (isClient) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_refresh_token", refreshToken);
        localStorage.setItem("auth_user_id", userId);
        localStorage.setItem("auth_user_email", email);
        localStorage.setItem("auth_username", username);
        if (avatarUrl) {
          localStorage.setItem("auth_avatar", avatarUrl);
        } else {
          localStorage.removeItem("auth_avatar");
        }
        localStorage.setItem("auth_roles", JSON.stringify(rolesList));
        localStorage.setItem("auth_permissions", JSON.stringify(permissionsList));
        
        // Write cookie for Next.js Middleware route guarding.
        // Secure flag only set on HTTPS (production) to avoid breaking HTTP localhost.
        const isSecure = window.location.protocol === "https:";
        document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax${isSecure ? "; Secure" : ""}`;
      }
      set({ token, refreshToken, userId, userEmail: email, username, avatar: avatarUrl, roles: rolesList, permissions: permissionsList });
    },
    setUserData: (email, username, avatarUrl, rolesList, permissionsList) => {
      if (isClient) {
        localStorage.setItem("auth_user_email", email);
        localStorage.setItem("auth_username", username);
        if (avatarUrl) {
          localStorage.setItem("auth_avatar", avatarUrl);
        } else {
          localStorage.removeItem("auth_avatar");
        }
        localStorage.setItem("auth_roles", JSON.stringify(rolesList));
        localStorage.setItem("auth_permissions", JSON.stringify(permissionsList));
      }
      set({ userEmail: email, username, avatar: avatarUrl, roles: rolesList, permissions: permissionsList });
    },
    updateTokens: (token, refreshToken) => {
      if (isClient) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_refresh_token", refreshToken);
        const isSecure = window.location.protocol === "https:";
        document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax${isSecure ? "; Secure" : ""}`;
      }
      set({ token, refreshToken });
    },
    updateAvatar: (avatarUrl: string) => {
      if (isClient) {
        localStorage.setItem("auth_avatar", avatarUrl);
      }
      set({ avatar: avatarUrl });
    },
    clearAuthSession: () => {
      if (isClient) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_refresh_token");
        localStorage.removeItem("auth_user_id");
        localStorage.removeItem("auth_user_email");
        localStorage.removeItem("auth_username");
        localStorage.removeItem("auth_avatar");
        localStorage.removeItem("auth_roles");
        localStorage.removeItem("auth_permissions");
        
        // Clear cookie
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      set({ token: null, refreshToken: null, userId: null, userEmail: null, username: null, avatar: null, roles: [], permissions: [] });
    },
  };
});

