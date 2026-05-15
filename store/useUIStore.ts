import { create } from 'zustand';

type UIStore = {
  loading: boolean;

  setLoading: (
    loading: boolean
  ) => void;

  notificationsOpen: boolean;

  toggleNotifications: () => void;
};

export const useUIStore =
  create<UIStore>((set) => ({
    loading: false,

    setLoading: (loading) =>
      set({
        loading,
      }),

    notificationsOpen: false,

    toggleNotifications: () =>
      set((state) => ({
        notificationsOpen:
          !state.notificationsOpen,
      })),
  }));