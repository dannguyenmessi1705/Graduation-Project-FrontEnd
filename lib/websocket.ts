import { Client, Message } from "@stomp/stompjs";
import { getJwtToken } from "./auth";
import { Notification } from "@/model/NotificationData";

let stompClient: Client | null = null;
const subscribers: ((notification: Notification) => void)[] = [];

export function connectWebSocket() {
  if (stompClient) {
    return;
  }

  const token = getJwtToken();
  if (!token) {
    return;
  }

  // Parse userId from JWT token
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const userId = tokenPayload.sub || tokenPayload.userId;

  stompClient = new Client({
    brokerURL: `ws://api.forum.didan.id.vn/forum/notifications/ws?userId=${userId}`,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: function (str) {
      console.log("STOMP: " + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = function () {
    stompClient?.subscribe("/notifications/topic", function (message: Message) {
      const notification: Notification = JSON.parse(message.body);
      notifySubscribers(notification);
    });
  };

  stompClient.onStompError = function (frame) {
    console.error("STOMP error", frame);
  };

  stompClient.activate();
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}

export function subscribeToNotifications(
  callback: (notification: Notification) => void
) {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
}

function notifySubscribers(notification: Notification) {
  subscribers.forEach((callback) => callback(notification));
}
