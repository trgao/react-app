import Navbar from "../components/Navbar";
import PostForm from "../components/PostForm";
import { useParams } from "react-router-dom";

function Edit() {
    const urlparam = useParams();
    const url = 'http://localhost:3000/api/v1/posts/' + urlparam.id;

    return (
        <div>
            <Navbar />
            <div className="main">
                <PostForm url={url} id={urlparam.id}/>
            </div>
        </div>
    );
}

export default Edit;