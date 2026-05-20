import { SearchUIProvider} from "../../contexts/SearchUIProvider";
import MainLayoutContent from "./MainLayoutContent";


function MainLayout ({ children }) {
    return (
        <MainLayoutContent>
            {children}
        </MainLayoutContent>
    );
};

export default MainLayout;