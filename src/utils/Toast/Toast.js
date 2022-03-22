import { Easing, Overlay } from "react-native";

const toast = Overlay.Toast;

export default class Toast {
    static showDangerToast(message, time_ms) {
        if (time_ms) {
            time_ms = 3000;
        }
        toast.show(message, time_ms, {
            textStyle: {
                backgroundColor: "#FFD6B3",
                color: "#7A0C10",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
    static showSuccessToast(message, time_ms) {
        if (time_ms) {
            time_ms = 3000;
        }
        toast.show(message, time_ms, {
            textStyle: {
                backgroundColor: "#C0F9B1",
                color: "#0A5E2E",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
    static showWarningToast(message, time_ms) {
        if (time_ms) {
            time_ms = 3000;
        }
        toast.show(message, time_ms, {
            textStyle: {
                backgroundColor: "#FFF9A4",
                color: "#7A6C05",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
    static showInfoToast(message, time_ms) {
        if (time_ms) {
            time_ms = 3000;
        }
        toast.show(message, 3000, {
            textStyle: {
                backgroundColor: "#9FD9FF",
                color: "#02247A",
                borderWidth: 0,
            },
            position: toast.Position.Top,
            animateEasing: Easing.in(Easing.bounce),
        });
    }
}
