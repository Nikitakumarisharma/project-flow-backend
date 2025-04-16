const {post} =require('../models/postModel');


const generateReferenceId = () => {
  const prefix = "CMT";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

const createPost = async (req, res) => {
  try{
    const newpost =new post ({
      clientName: req.body.clientName,
      clientEmail: req.body.clientEmail,
      clientPhone: req.body.clientPhone,
      description: req.body.description,
      requirements: req.body.requirements,
      referenceId: generateReferenceId(),
      status: req.body.status || "requirements",  
    });
    const postData= await newpost.save();
    res.status(200).send({
      message: 'Post created successfully',
      data:postData,
    });
  }catch(err){
    res.status(400).send(err.message);
}
}
const addNote = async (req, res) => {
  try {
    
    const projectId = req.params.projectId; // Get the projectId from the URL parameter
    const noteData = req.body;  // Get note data from the request body

    console.log("Received note data:", noteData); // Log the note data received

    // Find the project by ID
    const project = await post.findById(projectId);
    if (!project) {
      console.log("Project not found");
      return res.status(404).send({ message: "Project not found" });
    }


    // Add the new note to the project
    project.notes.push(noteData);
    console.log("Updated project notes:", project.notes); // Log updated notes

    // Save the updated project with the new note
    await project.save();
    console.log("Project saved successfully");

    // Return the updated project data
    res.status(200).send({
      success: true,
      message: "Note added successfully",
      data: project,  // Optionally return the updated project
    });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await post.findById(projectId);

    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    res.status(200).send({
      success: true,
      data: project.notes,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
const getPosts = async (req, res) => {
  try {
    const Posts=await post.find({});
    res.status(200).send({scucess:true,
      message: 'Posts fetched successfully',
      data: Posts,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}



const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await post.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).send({ success: false, message: 'Post not found' });
    }

    res.status(200).send({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const id = req.body.id;
    const title = req.body.title;
    const date = req.body.date;

    if (req.file !== undefined) {
      const image = req.file.filename;

      await post.findByIdAndUpdate(
        { _id: id },
        { $set: { title, date, image } }
      );

      res.status(200).send({
        success: true,
        message: 'Post updated successfully with image',
      });
    } else {
      await post.findByIdAndUpdate(
        { _id: id },
        { $set: { title, date } }
      );

      res.status(200).send({
        success: true,
        message: 'Post updated successfully without image',
      });
    }
  } catch (error) {
    console.error('❌ Update Error:', error);
    res.status(500).send({ success: false, message: error.message });
  }
};

const approveProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { developerId, deadline, approved } = req.body;

    const updatedProject = await post.findByIdAndUpdate(
      id,
      { 
        $set: { 
          approved: true,
          assignedTo: developerId,
          deadline: new Date(deadline)
        }
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project approved and assigned successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Error approving project:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
     createPost,getPosts,deletePost,updatePost,addNote,getNotes,approveProject
}