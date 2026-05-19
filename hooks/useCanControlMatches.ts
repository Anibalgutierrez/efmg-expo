import {
  useUserStore,
} from '../store/useUserStore';

export default function useCanControlMatches() {

  const user =
    useUserStore(
      (state) => state.user,
    );

  return (

    user?.role ===
      'admin' ||

    user?.role ===
      'collaborator'
  );
}