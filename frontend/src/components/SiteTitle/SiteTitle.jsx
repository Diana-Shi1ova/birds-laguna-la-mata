import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";


function SiteTitle() {
    const location = useLocation();
    const { t } = useTranslation();
    const title = t('site.title');
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
            document.title = t('page.title.login') + " | " + title;
        } else if (path === "/register") {
            document.title = t('page.title.register') + " | " + title;
        } else if (path === "/favourites") {
            document.title = t('page.title.saved') + " | " + title;
        } else if (path === "/catalog") {
            document.title = t('page.title.catalog') + " | " + title;
        } else if (path === "/statistics") {
            document.title = t('page.title.statistics') + " | " + title;
        } else if (path.startsWith("/statistics/bird/")) {
            document.title = t('page.title.statistics_specie') + " | " + title;
        } else {
            document.title = title;
        }
    }, [location.pathname]);

    return null;
}

export default SiteTitle