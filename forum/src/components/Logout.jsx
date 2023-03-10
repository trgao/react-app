import axios from "axios";
import { setLoggedIn } from "..";
import { Link, useNavigate } from "react-router-dom";
import { MenuItem } from "@mui/material";

const Logout = ({ handleClose }) => {
    const url = 'http://localhost:3000/logout';
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleClick = () => {
        axios.delete(url, {headers:{"Authorization": 'Bearer ' + token}})
            .then(response => {
                console.log(response);
                setLoggedIn(false);
                localStorage.setItem('token', '');
                localStorage.setItem('id', '');
                localStorage.setItem('username', '');
                navigate('/');
            })
            .catch(error => console.log(error));
    };

    return (
        <Link onClick={handleClick}><MenuItem onClick={handleClose}>Logout</MenuItem></Link>
    );
}

export default Logout;