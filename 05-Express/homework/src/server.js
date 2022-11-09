// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());
// server.METHOD(URL, (req, res, next) => {})
// IMPORTANTE SI VAMOS A TRABAJAR CON req.body, ES DECIR VAMOS RECIBIR INFORMACION POR BODY, NO OLVIDAR ACTIVAR EL MIDDLEWARE DE express.json()
// TODO: your code to handle requests
const PATH = '/posts';
let id = 1;

server.post(PATH, (req, res) => {
    const {author, title, contents} = req.body;
    if(!author || !title || !contents){
        return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"});
    }

    const post = {
        author, title, contents, id: id++
    };
    posts.push(post);

    res.status(200).json(post);

});

server.post(`${PATH}/author/:author`, (req, res) => { 
    let {author} = req.params; //let author = req.params.author
    let {title, contents} = req.body; //let title = req.body. title let contents = req.body.contens

    if(!author || !title || !contents){
        return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"});
    }

    const post = {
        author, title, contents, id: id++
    };
    posts.push(post);

    res.status(200).json(post);
});

server.get(PATH, (req, res) => {
    let { term } = req.query;
    if(term) {
        const term_posts = posts.filter(
            (p) => p.title.includes(term) || p.contents.includes(term)
        );
        return res.json(term_posts);
    }
    res.json(posts);
});

server.get(`${PATH}/:author`, (req, res) => {
    let { author } = req.params;
     const posts_author = posts.filter( p => p.author === author);
     if(posts_author.length > 0){
        return res.json(posts_author);
     }else{
         res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"});
     }
});

server.get(`${PATH}/:author/:title`, (req, res) => {
    let {author, title} = req.params;
    if(author && title){
        const new_posts = posts.filter(p => p.author === author && p.title === title);
        if(new_posts.length > 0){
            res.json(new_posts);
        }else{
            res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"});
        }
    }else{
        res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"});
    }
});

server.put(PATH, (req, res) => {
    let {id, title, contents} = req.body;
    if (id && title && contents){
        console.log(id, title, contents);
        let post = posts.find(p => p.id === parseInt(id));
        if (post){
            post.title = title;
            post.contents = contents;
            res.json(post);
        }else{
            res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"});
        }
    }else{
        res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"});
    }
    res.send('done');
});
server.delete(PATH, (req, res) => {
    let {id} = req.body;

    const post = posts.find(p => p.id === parseInt(id));
    if(!id || !post){
        return res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"});
    }

    posts = posts.filter(p => p.id !== parseInt(id));
    res.json({ success: true});
});

server.delete('/author', (req, res) => {
    let {author} = req.body;
    const author_found = posts.find(p => p.author === author);
    if (!author || !author_found) {
        return res.status(STATUS_USER_ERROR).json({error: "No existe el autor indicado"});
    }

    let delete_authors = [];

    //opcion1
    //delete_authors = posts.filter(p => p.author === author);
    //posts = posts.filter(p => p.author !== author);

    //opcion2
    posts = posts.filter (p => {
        if(p.author !== author){
            return true;
        }else{
            delete_authors.push(p);
        }
    });
    return res.json(delete_authors);
});

module.exports = { posts, server };
