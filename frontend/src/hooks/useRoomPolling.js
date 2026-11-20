import { useState, useEffect } from "react";
import { request } from "../services/api";

export function useRoomPolling({ code, token, userId }) {
  const [state, setState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const res = await request(`/rooms/${code}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!mounted) return;
        setIsHost(data.room.host_id === userId);
        setLoaded(true);
      } catch (err) {
        console.error(err);
      }
    }

    async function poll() {
      if (!mounted) return;
      try {
        const res = await request(`/rooms/${code}/state`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!mounted) return;
        setState(data);
      } catch (err) {
        console.error(err);
      }
    }

    init();

    poll();
    const interval = setInterval(poll, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [code, token, userId]);

  return { state, setState, loaded, isHost };
}
