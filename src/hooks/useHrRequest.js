import useSWR from "swr";

import axios from "@/lib/axios";
import Swal from "sweetalert2";

export const useHr = ({ name, status, page = 1 }) => {
  const { data: clients, mutate } = useSWR(
    `/api/hr-search-request/${name || 0}/${status || 12}?page=${page}`,
    () =>
      axios
        .get(`/api/hr-search-request/${name || 0}/${status || 12}?page=${page}`)
        .then((res) => res.data)
        .catch((error) => {
          if (error.response?.status !== 409) throw error;
          alert("error");
        }),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: true,
      refreshInterval: 10000,
    },
  );

  const csrf = () => axios.get(`/sanctum/csrf-cookie`);

  const swasuccess = (title, text) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: title,
      text: text,
      showConfirmButton: true,
    });
  };

  const swaerror = (title, text) => {
    const ntext = text?.replace(/ *\([^)]*\) */g, "").replace("values)", "");
    Swal.fire({
      position: "center",
      icon: "error",
      title: title,
      text: ntext,
      showConfirmButton: true,
    });
  };

  const searchRequest = async ({ setLoading }) => {
    await csrf();

    let runfinally = true;

    const controller = new AbortController();
    const signal = controller.signal;

    axios
      .get(`/api/hr-search-request/${name || 0}/${status || 2}?page=${page}`, {
        signal: signal,
      })
      .then(() => mutate())
      .catch((error) => {
        const nerror = error?.response?.data?.message;
        swaerror("Search not found", nerror);
        runfinally = false;
      })
      .finally(() => {
        setLoading(false);
        if (runfinally) {
          //swasuccess('Client Found', '')
        }
      });
  };

  const updateRequestApproval = async ({
    setRequest,
    setClient,
    setLoading,
    ...props
  }) => {
    let runfinally = true;

    await csrf();

    try {
      const response = await axios.post(
        `/api/hr-update-request-approval`,
        props,
      );
      mutate();
      // console.log(response);
      const result = response.data;
      Swal.fire({
        title: "Updated",
        text: `Your have successfully updated the request for LOA`,
        icon: "success",
      });
      setRequest(result?.all);
      setClient(result?.client[0]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Update Failed",
        text: `${error}`,
        icon: "error",
      });
      runfinally = false;
      setLoading(false);
    }
  };

  const viewBy = async (row, type) => {
    await csrf();

    try {
      const response = await axios.post(`/api/hr/view-by`, {
        type: type,
        ...row,
      });

      if (!response.data.status) {
        Swal.fire({
          text: response.data.message,
          icon: "error",
        });
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    clients: clients?.data || clients,
    pagination: clients,
    searchRequest,
    updateRequestApproval,
    viewBy,
  };
};
