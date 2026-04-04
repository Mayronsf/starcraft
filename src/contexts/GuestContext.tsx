import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'starcraft_guest_session';

export type GuestContextValue = {
  isGuest: boolean;
  /** false até ler o localStorage (evita flash da tela de login). */
  guestReady: boolean;
  enterAsGuest: () => void;
  leaveGuest: () => void;
};

const GuestContext = createContext<GuestContextValue | null>(null);

export function GuestProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [guestReady, setGuestReady] = useState(false);

  useEffect(() => {
    try {
      setIsGuest(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      setIsGuest(false);
    }
    setGuestReady(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setIsGuest(false);
  }, [user]);

  const enterAsGuest = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setIsGuest(true);
  }, []);

  const leaveGuest = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setIsGuest(false);
  }, []);

  const value = useMemo<GuestContextValue>(
    () => ({ isGuest, guestReady, enterAsGuest, leaveGuest }),
    [isGuest, guestReady, enterAsGuest, leaveGuest],
  );

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}

export function useGuest(): GuestContextValue {
  const ctx = useContext(GuestContext);
  if (!ctx) {
    throw new Error('useGuest deve ser usado dentro de GuestProvider.');
  }
  return ctx;
}
