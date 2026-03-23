import "./Favourites.css" ;
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { UseAuth } from "../../auth/useAuth";
import { Navigate } from "react-router-dom";

function Favourites(){
    const { isAuth } = UseAuth();

    // Si no autorizado, se redirige a login
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return(
        <MainLayout>
            <h1>Favourites</h1>
        </MainLayout>
    );
}

export default Favourites;