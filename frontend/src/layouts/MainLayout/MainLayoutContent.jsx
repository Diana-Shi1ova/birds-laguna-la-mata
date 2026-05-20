import "./MainLayout.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { useSearchUI } from "../../contexts/SearchUIProvider";


function MainLayoutContent ({ children }) {
    const {isSearchOpen} = useSearchUI();

    return (
        <>
            <Header></Header>
            <main>
                {!isSearchOpen && <Sidebar />}
                <div className="main-content">
                    {children}
                </div>
            </main>
        </>
    );
};

export default MainLayoutContent;