import { toast } from "sonner";

type ToastType = "success" | "error" | "neutral";

export const showToast = (message: string, type: ToastType = "neutral") => {
    //   const baseClasses = "px-4 py-2 rounded-lg shadow-lg text-white";

    switch (type) {
        case "success":
            toast.success(message, {
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
            break;
        case "error":
            toast.error(message, {
                className: "bg-red-500 text-white border-none",
                duration: 4000,
            });
            break;
        case "neutral":
        default:
            toast(message, {
                className: "bg-gray-700 text-white",
                duration: 3000,
            });
            break;
    }
};