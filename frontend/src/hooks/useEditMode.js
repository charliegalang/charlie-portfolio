import useAuthStore from '../store/authStore';

export const useEditMode = () => {
  const { isLoggedIn } = useAuthStore();

  // Public view overrides everything
  if (window.location.search.includes('view=public')) return false;

  // Edit mode is only active if the user is logged in
  return isLoggedIn;
};
