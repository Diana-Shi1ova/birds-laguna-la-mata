import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";


function SiteTitle() {
    const location = useLocation();
    const { t } = useTranslation();
    const title = t('site.title');

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