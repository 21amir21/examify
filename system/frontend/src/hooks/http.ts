import { useState, useCallback, useRef, useEffect } from "react";

interface ErrorResponse {
  error: string;
  errorDetails: string[] | { msg: string }[];
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const activeHttpRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async (
      url: string,
      method: HttpMethod = "GET",
      body: BodyInit | null = null,
      headers: HeadersInit = {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (ctrl) => ctrl !== httpAbortCtrl
        );

        if (!response.ok) {
          const errorResponse = responseData as ErrorResponse;

          setErrorTitle(errorResponse.error);

          if (
            Array.isArray(errorResponse.errorDetails) &&
            typeof errorResponse.errorDetails[0] === "object" &&
            "msg" in errorResponse.errorDetails[0]
          ) {
            const firstMsg = (errorResponse.errorDetails[0] as { msg: string })
              .msg;
            setErrorDetails([firstMsg]);
          } else {
            setErrorDetails(errorResponse.errorDetails as string[]);
          }

          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setErrorTitle("Server Error");
        setErrorDetails([
          "Error connecting to server, please try again later.",
        ]);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setErrorTitle("");
    setErrorDetails([]);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, errorTitle, errorDetails, sendRequest, clearError };
};
