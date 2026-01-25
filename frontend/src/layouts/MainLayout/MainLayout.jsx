import { SearchUIProvider} from "../../contexts/SearchUIProvider";
import MainLayoutContent from "./MainLayoutContent";


function MainLayout ({ children }) {
    return (
        <SearchUIProvider>
            <MainLayoutContent>
                {children}
            </MainLayoutContent>
        </SearchUIProvider>
    );
};

export default MainLayout;