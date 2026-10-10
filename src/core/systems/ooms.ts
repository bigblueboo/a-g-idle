import { OOM_LINES } from "../../content/ooms";
import { oom } from "../derive";
import { pushLog } from "../log";
import { ALL_ERAS, type System } from "../system";

/** Each tick of the fifty-notch meter is an event with its own line. */
export const oomTicks: System = {
  id: "oomTicks",
  eras: ALL_ERAS,
  tick(s) {
    const now = Math.floor(oom(s));
    while (s.oomSeen < now) {
      s.oomSeen += 1;
      const line = OOM_LINES[s.oomSeen];
      if (line) pushLog(s, line, "system");
    }
  },
};
