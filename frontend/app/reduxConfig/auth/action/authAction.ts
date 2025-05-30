export const loginSuccess = (password: string) => ({
    type: 'LOGIN_SUCCESS' as const,
    payload: {
      password,
    },
  });