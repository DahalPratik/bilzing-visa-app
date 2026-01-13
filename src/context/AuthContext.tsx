import { api } from "@/lib/api";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { TOKEN_KEY } from "../constants/storage";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("Loaded token from storage:", token);

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({ token: token, authenticated: true });
      } else {
        setAuthState({ token: null, authenticated: false });
      }
    };
    loadToken();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      return await api.post(`/register`, { email, password });
    } catch (e) {
      return {
        error: true,
        msg: (e as any).response.data.message || "Registration failed",
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await api.post(`/login`, { email, password });
      console.log("Login success:", result.data);

      setAuthState({ token: result.data.token, authenticated: true });

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.token}`;

      // For storing token securely on device
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      return result;
    } catch (e) {
      return {
        error: true,
        msg: (e as any).response.data.message || "Login failed",
      };
    }
  };
  const logout = async () => {
    // Delete token from secure store]
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    // Clear axios authorization header
    api.defaults.headers.common["Authorization"] = "";

    // Reset auth state
    setAuthState({ token: null, authenticated: false });
  };
  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
