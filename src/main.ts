import "./skins/base.css";
import "./skins/eras.css";
import "./skins/panels.css";
import { start } from "./ui/app";

const root = document.getElementById("app");
if (!root) throw new Error("no #app");
start(root);
