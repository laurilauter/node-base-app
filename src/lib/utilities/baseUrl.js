let baseURL = import.meta.env.VITE_BASE_URL_DEV;
let baseURLWs = import.meta.env.VITE_BASE_URLWS_DEV;
if (import.meta.env.PROD) {
  baseURL = import.meta.env.VITE_BASE_URL_PROD;
  baseURLWs = import.meta.env.VITE_BASE_URLWS_PROD;
}

export { baseURL, baseURLWs };
