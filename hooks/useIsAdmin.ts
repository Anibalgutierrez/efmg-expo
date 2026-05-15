import {
  useUserStore,
} from '../store/useUserStore';

export default function useIsAdmin() {

  const user =
    useUserStore(
      (state) => state.user
    );

  return (
    user?.role ===
    'admin'
  );
}