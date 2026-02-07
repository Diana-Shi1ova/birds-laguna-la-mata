import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function SiteTitle() {
    const location = useLocation();
    const title = "Avistory"

    useEffect(() => {
        switch (location.pathname) {
        case "/":
            document.title = title;
            break;
        case "/login":
            document.title = "Login | " + title;
            break;
        case "/register":
            document.title = "Register | " + title;
            break;
        case "/favourites":
            document.title = "Especies guardadas | " + title;
            break;
        case "/catalog":
            document.title = "Catálogo de especies | " + title;
            break;graphs
        case "/graphs":
            document.title = "Gráficas | " + title;
            break;
        default:
            document.title = title;
        }
    }, [location.pathname]);

    return null;
}

export default SiteTitle