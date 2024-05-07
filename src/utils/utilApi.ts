type ApiCallOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string; // Assume JSON stringified
  headers?: Record<string, string>;
  credentials?: RequestCredentials; // This type is provided by TypeScript
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: Error;
  status?: number;
};

// Adjust the generic type T for expected data structure
export const apiCall = async <T>(
  url: string,
  options: ApiCallOptions
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Or dynamically from options if necessary
      ...options,
    });

    if (response.ok) {
      const data: T = await response.json();
      return { success: true, data };
    } else {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        errorData = response.statusText;
      }
      return {
        success: false,
        error: new Error(
          errorData.error || "Verification failed. Please try again."
        ),
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
};
