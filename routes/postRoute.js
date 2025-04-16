const express = require('express');
const Post_routes = express();

const bodyParser = require('body-parser');
Post_routes.use(bodyParser.json());
Post_routes.use(bodyParser.urlencoded({ extended: true }));

// 🧹 Removed multer, path, static, upload config — not needed

// ✅ Import post controller
const postController = require('../controllers/postController');

Post_routes.post('/create-post', postController.createPost);
Post_routes.get('/get-posts', postController.getPosts);

// Add this to handle adding notes to a specific post
Post_routes.post('/add-notes/:projectId', postController.addNote);
Post_routes.get('/get-notes/:projectId', postController.getNotes);


// Add route for approving projects
Post_routes.put('/approve-project/:id', postController.approveProject);

// 🗑️ Delete post by ID
Post_routes.delete('/delete-posts/:id', postController.deletePost);
Post_routes.post('/update-post', postController.updatePost);

module.exports = Post_routes;
