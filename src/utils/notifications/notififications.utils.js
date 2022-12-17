import "react-notifications/lib/notifications.css";
import { NotificationManager } from "react-notifications";

export const TYPES_NOTIFICATION = {
	info: "info",
	success: "success",
	warning: "warning",
	error: "error"
};

export const createNotification = (type, msg, subMsg) => {
	switch (type) {
		case TYPES_NOTIFICATION.info:
			NotificationManager.info(msg, subMsg);
			break;
		case TYPES_NOTIFICATION.success:
			NotificationManager.success(msg, subMsg);
			break;
		case TYPES_NOTIFICATION.warning:
			NotificationManager.warning(msg, subMsg, 3000);
			break;
		case TYPES_NOTIFICATION.error:
			NotificationManager.error(msg, subMsg, 3000);
			break;
		default:
			break;
	}
};
