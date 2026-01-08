export const ROUTES = {
  auth: {
    login: "/pages/auth/login",
    register: "/pages/auth/register",
  },

  public: {
    products: "/pages/public/product",
  },

  admin: {
    root: "/admin",
  },
} as const;
