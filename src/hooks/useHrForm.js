import axios from "@/lib/axios";
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
    }));
  });

  const submitHrForms = async ({ setLoading, ...props }) => {
    await csrf();

    axios
      .post("/api/submit-hr-patient", props)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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
