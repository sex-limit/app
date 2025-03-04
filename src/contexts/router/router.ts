import { useRouter } from 'expo-router';
import { createGlobalStore } from 'hox';

export const [useRouterStore, getRouterStore] = createGlobalStore(() => {
  const router = useRouter();

  const goAuth = () => {
    router.navigate('/login');
  };

  return {
    goAuth,
  };
});
