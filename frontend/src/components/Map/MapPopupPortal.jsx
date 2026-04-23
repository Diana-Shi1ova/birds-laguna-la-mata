import { createPortal } from "react-dom";

function MapPopupPortal({ container, children }) {
    if (!container) return null;

    return createPortal(children, container);
}

export default MapPopupPortal;