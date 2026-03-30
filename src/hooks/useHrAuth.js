import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useHrAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/hr/user", () =>
    axios
      .get("/hr/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status !== 409) throw error;
      }),
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const register = async ({ setErrors, setLoading, ...props }) => {
    await csrf();

    setErrors([]);

    axios
      .post("/hr/register", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response?.status !== 422) throw error;
        setErrors(error.response.data.errors);
      })
      .finally(() => setLoading && setLoading(false));
  };

  const login = async ({ setErrors, setStatus, setLoading, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/hr/login", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response?.status !== 422) throw error;
        setErrors(error.response.data.errors);
      })
      .finally(() => setLoading && setLoading(false));
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/hr/logout").then(() => mutate());
    }

    window.location.pathname = "/hr/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }

    if (
      window.location.pathname !== "/hr/login" &&
      window.location.pathname !== "/hr/register" &&
      middleware === "auth" &&
      error
    ) {
      logout();
    }
  }, [user, error]);

  return {
    user,
    register,
    login,
    logout,
  };
};
