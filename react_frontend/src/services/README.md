# ApiService notes

The ApiService currently persists tasks in localStorage under the key `tasks:v1`.

If REACT_APP_API_BASE or REACT_APP_BACKEND_URL is provided, the service is prepared to switch to HTTP in the future. For now, to respect the requirement, it always falls back to local storage unless those env variables are set and the HTTP implementation is extended.
