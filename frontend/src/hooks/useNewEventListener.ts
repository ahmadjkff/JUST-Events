import { useEffect } from "react";
import {
  onNewEventCreated,
  removeNewEventListener,
} from "../services/socketService";
import toast from "react-hot-toast";

export const useNewEventListener = (callback?: (event: any) => void) => {
  useEffect(() => {
    const handleNewEvent = (data: any) => {
      const { event } = data;
      toast.success(`New event created: "${event.title}"`);
      if (callback) {
        callback(event);
      }
    };

    onNewEventCreated(handleNewEvent);

    return () => {
      removeNewEventListener(handleNewEvent);
    };
  }, [callback]);
};
