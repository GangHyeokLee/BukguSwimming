export function parseJwt() {
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload).role;
    } catch (error) {
      console.error('JWT 파싱 실패:', error);
      return null;
    }
  }
  return null;
};