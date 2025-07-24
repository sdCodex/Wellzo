import { useState } from "react";
import { toast } from "sonner";

function useFetch<T, Args extends any[]>(cb: (...args: Args) => Promise<T>){
  const [data, setData] = useState<T|undefined>(undefined);
  const [loading, setLoading] = useState<boolean|null>(null);
  const [error, setError] = useState<Error|null>(null);

  const fn = async (...args:Args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error:any) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;