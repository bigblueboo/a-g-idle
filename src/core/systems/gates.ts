import { currentEra, gateSatisfied } from "../derive";
import { pushLog, setTicker } from "../log";
import { ALL_ERAS, type System } from "../system";

/** Watches the era gate. Crossing it is always the player's hold, never automatic. */
export const gates: System = {
  id: "gates",
  eras: ALL_ERAS,
  tick(s) {
    const ready = gateSatisfied(s);
    const gate = currentEra(s).gate;
    if (ready && !s.gateReady && gate) {
      pushLog(s, `${gate.title}. ${gate.text}`, "system");
      setTicker(s, gate.title, 30);
    }
    s.gateReady = ready;
  },
};
