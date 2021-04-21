import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Box, Button, CircularProgress, Divider, List, ListItem, ListItemText, TextField} from '@material-ui/core';

import { useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import Comment from "./Comment";

const CommentList = (props) => {

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setEror] = useState(null);
    const auth = useContext(AuthContext);

    useEffect(() => {
        console.log(props);
        setComments(props.comments);
    },[]);

    const handleChange = (e) => {
        setNewComment(e.target.value); 
    };

    const handleAddComment = async(e) => {
        e.preventDefault();
        
        console.log(newComment);

        let config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
        };

        let data = {
            postID: props.postID,
            comment: newComment
        };

        try {
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + 'comments',
                data,
                config
            );

            setComments([...comments, {
                comment: newComment,
                userId: localStorage.getItem('userId'),
                username: localStorage.getItem('username'),
                date: new Date()
            }]);

            setNewComment('');
            console.log(response);

        } catch (err) {
            console.log(err.response.data);
        }
    }

    const handleDelete = (componentindex) => {
        let refreshedComments = [...comments];
        refreshedComments.splice(componentindex,1);
        setComments(refreshedComments);
    }

    return (

        <List>
            <Divider />
            {comments.map((c,index) => (
                <Comment comment={c} postOwner={props.postOwner} handleDelete={handleDelete}
                postID={props.postID} key={index} index={index}/> 
            ))}
            
            {auth.isLoggedIn && 
            <Box display="flex" flexDirection="column" width="100%" padding="16px">
                <h4>New Comment:</h4>
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Box display="block" width="100%">
                        <TextField variant="outlined" label="New Comment" multiline rows={4} fullWidth
                            name="comment" onChange={handleChange} value={newComment}/>
                    </Box>
                </Box>
                <Box display="flex" justifyContent="center" marginTop="16px">
                    <Button variant="contained" color="primary" onClick={handleAddComment}>Add comment</Button>
                </Box>
            </Box>
            }

        </List>
     
    );
  };
export default CommentList;