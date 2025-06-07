export const handleRequest = async (requestFn:any) => {
  try {
    const res = await requestFn();
    return {
      success: true,
      data: res.data, 
      status: res.status,
    };
  } catch (error:any) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || error.message || "Unknown error";

    console.error("API error:", { status, message });

    return {
      success: false,
      status,
      message,
    };
  }
};
