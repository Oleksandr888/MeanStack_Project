import { Box, Button, Card, CardContent, CircularProgress, FormControl, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import CustomMap from './CustomMap';

const CreatePostForm = (props) => {

    const [post, setPost] = useState({
        title: '',
        place: '',
        country: '',
        image: '',
        description: '',
        category: ''
    });
    const [image, setImage] = useState(null);
    const fileInputRef = useRef();
    const mapRef = useRef();
    const [focus, setFocus] = useState(false);
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false); 

    const handleChange = (e) => {
        setPost( {...post, [e.target.name] : e.target.value} );
    };

    const handleChangeLocation = (latitude, longitude) => {
        setPost({...post, lat: latitude, lng: longitude});
    }

    const readFileAsync = (file) => {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.readAsDataURL(file)
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
        })
    }

    useEffect(() => {
        const loadData = async() => {
            const categoryData = await axios.get(process.env.REACT_APP_BACKEND_URL + 'categories');
            const countryData = await axios.get('https://restcountries.eu/rest/v2/all');
            setCategories(categoryData.data);
            setCountries(countryData.data);
            setPost({
                ...post,
                category: categoryData.data[0].header,
                country: countryData.data[0].name
            });
        }
        loadData();
    },[]);

    useEffect(() => {
        //Converting image to base64 string
        const imageToBase64 = async() => {
            if (image){
                const imageString = await readFileAsync(image);
                setPost( {...post, image : imageString} );
            }
        }
        imageToBase64();

    }, [image]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(post);
        const location = (mapRef.current.state.markerPosition);
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
        };

        let data = {
            ...post, 
            lat: location.lat(),
            lng: location.lng()
        };
        console.log(data);

        try {
            setLoading(true);
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + 'posts',
                data,
                config
            );
            setLoading(false);

            console.log(response);

        } catch (err) {
            console.log(err.response.data);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDragEnter = (e) => {
        e.preventDefault();
        setFocus(true);
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        setFocus(false);
    }

    const handleFileDrop = (e) => {
        e.preventDefault();
        setImage(e.dataTransfer.files[0]);
    }

    const fileInputClicked = () => {
        fileInputRef.current.click();
    }

    const fileSelected = () => {
        setImage(fileInputRef.current.files[0]);
    }

    if (loading) return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">

          <CircularProgress size={80}/>

        </Box>
    )

    return (
        <Box width="60%" marginX="auto" marginTop="40px">
        <Card>
            <CardContent>
                {/* <form onSubmit={handleSubmit} encType="multipart"> */}
                    <h2>Create New Post</h2>
                    <hr/>
                    <Box display="flex" flexDirection="row" alignItems="center"
                     width="80%" marginTop="20px">
                        <Typography variant="h6">Post Title:</Typography>
                        <Box marginLeft="10px">
                            <TextField required variant="outlined" label="Title" size="small"
                                name="title" onChange={handleChange} value={post.title}/>
                        </Box>
                    </Box>

                    <Box display="flex" flexDirection="row" alignItems="center"
                     width="80%" marginTop="20px">
                        <Typography variant="h6">Place:</Typography>
                        <Box marginLeft="10px">
                            <TextField required variant="outlined" label="Place" size="small"
                                name="place" onChange={handleChange} value={post.place}/>
                        </Box>
                    </Box>

                    <Box display="flex" flexDirection="row" alignItems="center"
                     width="80%" marginTop="20px">
                        <Typography variant="h6">Country:</Typography>
                        <Box marginLeft="10px">
                            <FormControl variant="outlined" size="small" fullWidth>
                                <Select
                                name="country"
                                value={post.country}
                                onChange={handleChange}>
                                    {countries.map((c) => (
                                        <MenuItem value={c.name} key={c.alpha3Code}>{c.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Box>
                    </Box>

                    <Box display="flex" flexDirection="row" alignItems="center"
                     width="80%" marginTop="20px">
                        <Typography variant="h6">Category:</Typography>
                        <Box marginLeft="10px">
                            <FormControl variant="outlined" size="small">
                                <Select
                                name="category"
                                value={post.category}
                                onChange={handleChange}>
                                    {categories.map((c) => (
                                        <MenuItem value={c.header} key={c._id}>{c.header}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box width="100%" marginTop="20px">
                        <Typography variant="h6">Location:</Typography>
                        <Box width="100%" height="200px">                          
                            <CustomMap 
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&language=EN&key=
                                ${process.env.REACT_APP_GOOGLE_KEY}`}
                                loadingElement={<div style={{ height: `100%` }} />}
                                containerElement={<div style={{ height: `100%` }} />}
                                mapElement={<div style={{ height: `100%` }} />}
                                ref={mapRef} setCoordinates={handleChangeLocation}
                            />
                        </Box>
                    </Box>

                    <Box marginTop="20px">
                        <Typography variant="h6">Picture:</Typography>
                    
                        <Box width="100%" height="100px" marginTop="10px" display="flex" justifyContent="center" alignItems="center"
                        className={(focus) || (image) ? 'dropzone-focused' : 'dropzone'} onClick={fileInputClicked}
                        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleFileDrop}
                        onDragOver={handleDragOver}>
                            {(image) &&
                                <div>{image.name}</div>
                            }
                            {(!image) &&
                                <div>Drop Image here or click to Upload</div>
                            }
                        </Box>
                        <Box display="none">
                            <input ref={fileInputRef} type="file" onChange={fileSelected}/>
                        </Box>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="flex-start" marginTop="30px">
                        <Typography variant="h6">Description:</Typography>
                        <Box display="block" marginTop="10px" width="100%">
                            <TextField variant="outlined" label="Description" multiline rows={4} fullWidth
                                name="description" onChange={handleChange} value={post.description}/>
                        </Box>
                    </Box>

                    <Box display="flex" justifyContent="center" marginTop="40px">
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
                    </Box>

                {/* </form> */}
                

            </CardContent>
        </Card>
        </Box>
    );

}

export default CreatePostForm;