export const navigateHome = async (navigate) => {
  await new Promise(r => setTimeout(r, 1000));
  navigate('/');
};