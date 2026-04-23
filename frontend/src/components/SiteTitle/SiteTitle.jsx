import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function SiteTitle() {
    const location = useLocation();
    const title = "Avistory";
    /*const { bird } = useParams();

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
            break;
        case "/statistics":
            document.title = "Estadísticas | " + title;
            break;
        case `/statistics/${bird}`:
            document.title = "Estadísticas de especie | " + title;
            break;
        default:
            document.title = title;
        }
    }, [location.pathname, bird]);*/

    useEffect(() => {
        const path = location.pathname;

        if (path === "/") {
            document.title = title;
        } else if (path === "/login") {
            document.title = "Login | " + title;
        } else if (path === "/register") {
            document.title = "Register | " + title;
        } else if (path === "/favourites") {
            document.title = "Especies guardadas | " + title;
        } else if (path === "/catalog") {
            document.title = "Catálogo de especies | " + title;
        } else if (path === "/statistics") {
            document.title = "Estadísticas | " + title;
        } else if (path.startsWith("/statistics/bird/")) {
            document.title = "Estadísticas de especie | " + title;
        } else {
            document.title = title;
        }
    }, [location.pathname]);

    return null;
}

export default SiteTitle