import axios from "@/lib/axios";
import Swal from "sweetalert2";
import useSWR from "swr";

export default function useHrForm() {
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const {
    data: companies = [],
    error,
    isLoading,
    mutate,
  } = useSWR("/api/hr-companies", async () => {
    const res = await axios.get("/api/hr-companies");

    return res.data.map((company) => ({
      name: company.name,
      value: String(company.value), // important: shadcn Select expects string values
      comp_code: company.comp_code,
    }));
  });

  const submitHrForms = async ({
    setLoading,
    reset,
    setSelectedHospital,
    ...props
  }) => {
    await csrf();

    axios
      .post("/api/submit-hr-patient", props)
      .then((res) => {
        if (res.status == 200) {
          Swal.fire({
            title: "Success",
            text: "Submit Form Successfully",
            icon: "success",
          });
          reset();
          setSelectedHospital("");
        }
      })
      .catch((err) => {
        if (err.status == 400) {
          Swal.fire({
            title: "Error",
            text: "Submit Form Error",
            icon: "error",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    companies,
    isLoading,
    error,
    mutate,
    submitHrForms,
  };
}
