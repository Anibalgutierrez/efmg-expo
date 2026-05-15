import {
  useUserStore,
} from '../store/useUserStore';

export default function useCanPost() {

  const user =
    useUserStore(
      (state) => state.user
    );

  return (
    user?.role ===
      'admin'
    ||
    user?.role ===
      'influencer'
  );
}