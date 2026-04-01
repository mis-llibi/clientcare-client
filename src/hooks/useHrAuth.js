import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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
      await axios
        .post("/hr/logout")
        .then(() => mutate())
        .catch(() => {});
    }

    window.location.pathname = "/hr/login";
  };

  const changePassword = async ({ setLoading, reset, ...props }) => {
    await csrf();

    axios
      .put("/hr/change-password", props)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password changed successfully!",
          confirmButtonColor: "#1E3161",
        });

        reset()
      })
      .catch((err) => {
        if (err.response?.status === 422) {
          const errors = err.response.data.errors;

          let errorMessages = "";

          Object.keys(errors).forEach((key) => {
            errorMessages += `${errors[key][0]}\n`;
          });

          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: errorMessages,
            confirmButtonColor: "#1E3161",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.response?.data?.message || "Something went wrong",
            confirmButtonColor: "#1E3161",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
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
    changePassword
  };
};
