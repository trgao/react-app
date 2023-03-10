import axios from 'axios';
import Navbar from '../components/Navbar';
import Delete from '../components/Delete';
import CommentForm from '../components/CommentForm';
import CommentsList from '../components/CommentsList';
import PostedBy from '../components/PostedBy';
import Share from '../components/Share';
import { getLoggedIn } from '..';
import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { Button, ToggleButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Copied from '../components/Copied';
import Tags from '../components/Tags';

function PostPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const urlparam = useParams();
    const user_id = localStorage.getItem('id');

    const [loaded, setLoaded] = useState(false);
    const [post, setPost] = useState({});
    const [tags, setTags] = useState([]);
    const [commentform, setCommentForm] = useState(false);
    const [correctuser, setCorrectUser] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [open, setOpen] = useState(false);
    const loggedin = getLoggedIn();

    const url = loggedin
                ? 'http://localhost:3000/api/v1/posts/' + urlparam.id + '?user_id=' + user_id
                : 'http://localhost:3000/api/v1/posts/' + urlparam.id;
    const likeurl = 'http://localhost:3000/api/v1/likes?post_id=' + urlparam.id + '&user_id=' + user_id

    useEffect(() => {
        axios.get(url)
            .then(response => {
                console.log(response);
                setPost(response.data);
                setTags(response.data.tags);
                setLiked(response.data.liked);
                setLikes(response.data.likes_count);
                if (user_id === response.data.user_id.toString()) {
                    setCorrectUser(true);
                }
                setLoaded(true);
            })
            .catch(error => {
                console.log(error);
                setPost({title: 'No post found'});
            });
    }, []);

    const handleClick = () => {
        if (loggedin) {
            setCommentForm(bool => !bool);
        } else {
            navigate('/login', { state: {from: location}, replace: true });
        }
    };

    const handleLike = (e, value) => {
        if (liked) {
            setLikes(likes => likes - 1);
        } else {
            setLikes(likes => likes + 1);
        }
        setLiked(!liked);
    };

    useEffect(() => {
        if (loaded) {
            if (post !== {} && loggedin) {
                if (liked) {
                    axios.post(likeurl)
                        .then(response => console.log(response))
                        .catch(error => console.log(error));
                } else {
                    axios.delete(likeurl)
                        .then(response => console.log(response))
                        .catch(error => console.log(error));
                }
            }
        }
    }, [liked]);

    return (
        <div>
            <Navbar />
            <div className="main">
                <PostedBy author={post.author} created_at={post.created_at} />
                <h1>{post.title}</h1>
                <Tags tags={tags} />
                <p className="text">{post.body}</p>
                <div className="likes">
                    <p>{likes}</p>
                    {loggedin
                    ? <ToggleButton 
                        onClick={handleLike} 
                        value={liked} 
                        selected={liked} 
                    >
                        <ThumbUpIcon />
                    </ToggleButton>
                    : <ThumbUpIcon />}
                </div>
                <div className="comments">
                    <p>{post.comments_count}</p>
                    <ChatBubbleIcon />
                </div>
                {loggedin ? <Button onClick={handleClick}>Comment</Button> : <></>}
                <Share setOpen={setOpen} />
                {loggedin && correctuser
                ? <div style={{display: 'inline-block'}}>
                    <Link to={"/edit/" + urlparam.id}><Button>Edit</Button></Link>
                    <Delete url={url} />
                </div>
                : <></>}
                {commentform ? <CommentForm /> : <></>}
                <CommentsList id={urlparam.id}/>
                <Copied open={open} setOpen={setOpen} />
            </div>
        </div>
    );
}

export default PostPage;