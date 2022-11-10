export const navigateHome = async (navigate) => {
  await new Promise(r => setTimeout(r, 500));
  navigate('/');
};