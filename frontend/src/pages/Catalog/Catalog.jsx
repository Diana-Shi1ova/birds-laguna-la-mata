import "./Catalog.css" ;
import MainLayout from "../../layouts/MainLayout/MainLayout";
import BirdListElement from "../../components/BirdListElement/BirdListElement";
import ListLayout from "../../layouts/ListLayout/ListLayout";

function Catalog(){
    const data = {
        name: 'Gavión atlántico',
        cientific: 'Larus Marinus',
        link: 'https://es.wikipedia.org/wiki/Larus_marinus',
        imagelink: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Great_Black-backed_Gull_Larus_marinus.jpg',
        observation: 'cerca del agua, entre 14:00-18:00'
    }

    return(
        <MainLayout>
            <h1>Catálogo de especies</h1>
            <ListLayout>
                <BirdListElement data={data}></BirdListElement>
                <BirdListElement data={data}></BirdListElement>
                <BirdListElement data={data}></BirdListElement>
                <BirdListElement data={data}></BirdListElement>
                <BirdListElement data={data}></BirdListElement>
            </ListLayout>
        </MainLayout>
    );
}

export default Catalog;