import "./MainLayout.css";
import Sidebar from "../../components/Sidebar/Sidebar";
// import Footer from "../../components/Footer/Footer";
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
            {/* <Footer></Footer> */}
        </>
    );
};

export default MainLayoutContent;