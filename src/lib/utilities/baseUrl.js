let baseURL = import.meta.env.VITE_BASE_URL_DEV;
if (import.meta.env.PROD) {
  baseURL = import.meta.env.VITE_BASE_URL_PROD;
}

export default baseURL;
