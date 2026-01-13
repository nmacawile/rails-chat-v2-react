import { useCallback, useState, useContext, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { ToastNotification } from "./ToastNotification.jsx";
import { useSelector } from "react-redux";
import { SharedChannelSubscriptionsContext } from "../contexts/SharedChannelSubscriptionsContext.jsx";

export function ToastNotifications() {
  const [notifications, setNotifications] = useState([]);
  const timers = useRef(new Map());
  const { user } = useSelector((state) => state.auth);
  const chatId = useParams().id;

  const sharedChannelSubscriptions = useContext(
    SharedChannelSubscriptionsContext
  );
  const incomingNotification = sharedChannelSubscriptions.notifications;

  const flash = (notification) => {
    const data = notification.message;
    const notifId = `chat-${data.chat.id}-notification`;

    setNotifications((prev) => {
      const [flashingNotificationIndex, flashingNotification] = Object.entries(
        prev
      ).find(([_, notification]) => notification.id == notifId) ?? [
        undefined,
        undefined,
      ];

      const newNotification = { id: notifId, data, exiting: false };

      if (flashingNotification)
        return [
          ...prev.slice(0, flashingNotificationIndex),
          newNotification,
          ...prev.slice(flashingNotificationIndex + 1),
        ];
      else return [newNotification, ...prev];
    });
    clearTimeout(timers.current.get(notifId));

    // create a timeout scheduled to be after approx. 2 seconds
    const timeout = setTimeout(() => {
      remove(notifId);
    }, 1700);
    timers.current.set(notifId, timeout);
  };

  const remove = (notifId) => {
    setNotifications((state) =>
      state.map((n) => {
        if (n.id === notifId) {
          return { ...n, exiting: true };
        }
        return n;
      })
    );

    setTimeout(() => {
      // Scheduled removal after fading out
      // timeout should be slightly greater than the fadeout duration
      setNotifications((state) =>
        state.filter((n) => !(n.id === notifId && n.exiting))
      );
    }, 300);
  };

  useEffect(() => {
    if (incomingNotification) {
      const { latest_message, id } = incomingNotification.message.chat;
      if (latest_message.user.id != user.id && chatId != id)
        flash(incomingNotification);
    }
  }, [incomingNotification]);

  return (
    <div className="-mt-4 gap-2 fixed flex flex-col inset-x-0 mx-auto z-[999] w-full max-w-sm">
      {/* <ToastNotification key={`notification-adfdsaf`} n={"fdsafdsafdasfdsafdsafsdafsdafdasfdsafsdafsdafasdf"} remove={remove} /> */}
      {notifications.map((notification, n) => (
        <ToastNotification
          key={notification.id}
          data={notification.data}
          exiting={notification.exiting}
          remove={() => remove(notification.id)}
          // delayExit={() => delayExit(n.id)}
        />
      ))}
    </div>
  );
}
