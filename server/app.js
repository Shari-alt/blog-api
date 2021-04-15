const express = require("express");
const db = require("./lib/db");
const cors = require("cors");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);
  next();
});

/*
  Get all blog posts as an array of objects in the body of the response.
  Status Code: 200 OK
*/
app.get("/posts", (req, res) => {
  // Inside this function i can write my code to do what's expected
  db.findAll()
    .then((posts) => {
      res.status(200);
      res.json(posts);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Internal Server Error: ${error}`,
      });
    });
});
/*
Create a blog post with the data coming in the body of the request
Response contains the newly created post
Example Body:
{
   "title": "The title of my blog post",
   "body": "The content of my blog post"
}
Status Code: 201 Created 
*/
app.post("/posts", (req, res) => {
  // console.log(req.body);
  // res.status(200);
  // res.json(req.body);
  db.insert(req.body)

    .then((newPost) => {
      console.log(newPost);
      res.json(newPost);
    })
    .catch((error) => {
      console.error(error);
      res.json(error);
    });
});
/*
  Endpoint to handle GET requests to the root URI "/"

*/
// app.get("/", (req, res) => {
//   res.json({
//     "/posts": "read and create new posts",
//     "/posts/:id": "read, update and delete an individual post",
//   });
// });

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((post) => {
      res.status(200);
      res.json(post);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: "internal Sever Error",
      });
    });
});

app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;

  db.updateById(id, req.body)
    .then((updatedPost) => {
      if (updatedPost) {
        res.status(200);
        res.json(updatedPost);
      } else {
        res.status(404);
        res.json({
          error: `Post with id: ${id} not found`,
        });
      }
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: "internal Sever Error",
      });
    });
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.deleteById(id)
    .then(() => {
      res.status(204);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: "internal Sever Error",
      });
    });
});

/*
  We have to start the server. We make it listen on the port 4000

*/
app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
