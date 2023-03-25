let baseURLWs = import.meta.env.VITE_BASE_URLWS_DEV;
if (import.meta.env.PROD) {
  baseURLWs = import.meta.env.VITE_BASE_URLWS_PROD;
}

export default baseURLWs;
