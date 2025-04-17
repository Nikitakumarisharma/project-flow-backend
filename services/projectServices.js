const { Project } = require('../models/projectModel');
const { User } = require('../models/userModel'); // Assuming you have the User model




class ProjectService {
  // 📌 Create a new project
  async create(projectData) {
    try {
      const now = new Date();
      const monthYear = `${now.getMonth() + 1}${now.getFullYear()}`; // MMYYYY
      const prefix = `CMT-${monthYear}-`;
  
      // 🟢 Find the highest referenceId for the current month
      const latestProject = await Project.findOne({
        referenceId: { $regex: `^${prefix}` }
      }).sort({ referenceId: -1 });
  
      let nextCounter = 1;
  
      if (latestProject) {
        const lastRefId = latestProject.referenceId;
        const lastCounter = parseInt(lastRefId.split('-')[2]);
        nextCounter = lastCounter + 1;
      }
  
      const paddedCounter = nextCounter.toString().padStart(3, '0');
      const referenceId = `${prefix}${paddedCounter}`;
  
      projectData.referenceId = referenceId;
  
      const project = new Project(projectData);
      return await project.save();
  
    } catch (error) {
      console.error('Error in project service create:', error);
      throw error;
    }
  }
  

  // 📌 Get all projects (with optional filter)
  async findAll(filter = {}) {
    return await Project.find(filter).populate('assignedTo');
  }

  // 📌 Find project by ID and populate assigned user data
  async findById(id) {
    return await Project.findById(id).populate('assignedTo');
  }

  // 📌 Get all projects assigned to a specific user
  async findByUserId(userId) {
    return await Project.find({ assignedTo: userId }).populate("assignedTo", "name email");
  }
  


  // 📌 Update project details
  async update(id, updateData) {
    // If assigning to a user, ensure it's a valid user
    if (updateData.assignedTo) {
      const user = await User.findById(updateData.assignedTo);
      if (!user) {
        throw new Error('User not found');
      }
    }

    return await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // 📌 Assign a user to a project
  async assignToUser(projectId, userId, deadline) {
    console.log('Assigning user to project with data:', { projectId, userId, deadline });
    
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    project.assignedTo = userId;
    project.approved = true;
    
    if (deadline) {
      console.log('Setting deadline:', deadline);
      project.deadline = new Date(deadline);
      console.log('Deadline set to:', project.deadline);
    }
    
    await project.save();
    
    // Return populated project data
    const populatedProject = await Project.findById(projectId).populate('assignedTo', 'name email');
    console.log('Returning populated project:', populatedProject);
    
    return populatedProject;
  }
  
  

  // 📌 Add a note to a project
  async addNoteToProject(projectId, noteData) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Add the note to the project
    project.notes.push(noteData);

    // Save the updated project with the new note
    return await project.save();
  }

  // 📌 Get all notes for a specific project
  async getNotes(projectId) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Return the notes for the project
    return project.notes;
  }

  // 📌 Delete a note from a project
  async deleteNoteFromProject(projectId, noteId) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Find the index of the note to delete
    const noteIndex = project.notes.findIndex(note => note._id.toString() === noteId);

    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    // Remove the note from the notes array
    project.notes.splice(noteIndex, 1);

    // Save the updated project
    return await project.save();
  }

  // 📌 Delete a project by ID
  async delete(id) {
    return await Project.findByIdAndDelete(id);
  }

  // 📌 Update project status
  async updateStatus(projectId, status) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    project.status = status;
    
    // If status is completed, set completion date
    if (status === 'completed' && !project.completionDate) {
      project.completionDate = new Date();
    }

    await project.save();
    
    // Return populated project data
    return await Project.findById(projectId).populate('assignedTo', 'name email');
  }
}

module.exports = new ProjectService();
