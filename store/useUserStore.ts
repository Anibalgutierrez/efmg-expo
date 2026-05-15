import {
  create,
} from 'zustand';

import {
  User,
} from '../types/user.types';

type UserStore = {

  user:
    User | null;

  loading:
    boolean;

  setUser: (
    user: User | null
  ) => void;

  setLoading: (
    loading: boolean
  ) => void;

  clearUser: () => void;
};

export const useUserStore =
  create<UserStore>(
    (set) => ({

      user: null,

      loading: true,

      setUser: (user) =>
        set({
          user,
        }),

      setLoading: (
        loading
      ) =>
        set({
          loading,
        }),

      clearUser: () =>
        set({
          user: null,
        }),
    })
  );