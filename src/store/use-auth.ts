import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: number;
}

export interface AuthSession {
  user: Omit<User, 'password'>;
}

interface AuthState {
  session: AuthSession | null;
  users: User[];
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateProfile: (name: string, email: string, newPassword?: string) => void;
  checkSession: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      users: [],

      login: (email, password) => {
        const { users } = get();
        const user = users.find((u) => u.email === email && u.password === password);

        if (!user) {
          throw new Error('Invalid email or password');
        }

        const { password: _, ...userWithoutPassword } = user;
        set({ session: { user: userWithoutPassword } });
      },

      register: (name, email, password) => {
        const { users } = get();
        if (users.some((u) => u.email === email)) {
          throw new Error('Email already exists');
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
          password,
          createdAt: Date.now(),
        };

        set({ users: [...users, newUser] });

        const { password: _, ...userWithoutPassword } = newUser;
        set({ session: { user: userWithoutPassword } });
      },

      logout: () => {
        set({ session: null });
      },

      updateProfile: (name, email, newPassword) => {
        const { session, users } = get();
        if (!session) throw new Error('Not authenticated');

        if (email !== session.user.email && users.some(u => u.email === email)) {
          throw new Error('Email already exists');
        }

        const updatedUsers = users.map(u => {
          if (u.id === session.user.id) {
            return {
              ...u,
              name,
              email,
              ...(newPassword ? { password: newPassword } : {})
            };
          }
          return u;
        });

        set({
          users: updatedUsers,
          session: { user: { ...session.user, name, email } },
        });
      },

      checkSession: () => {
        const { session } = get();
        return !!session;
      },
    }),
    {
      name: 'ecommerce-auth-storage',
    }
  )
);
