const { Project } = require('../models/projectModel');
const { User } = require('../models/userModel'); // Assuming you have the User model


let currentMonth = '';  // To store the current month and year
let counter = 0; 

class ProjectService {
  // 📌 Create a new project
  async create(projectData) {
    const now = new Date();
    const monthYear = `${now.getMonth() + 1}${now.getFullYear()}`; // Format MM-YYYY

    // Check if the month has changed, and reset the counter
    if (monthYear !== currentMonth) {
      currentMonth = monthYear;
      counter = 0; // Reset counter for the new month
    }

    // Increment the counter
    counter++;

    // Format the counter to be 3 digits (e.g., 001, 002, 003)
    const count = counter.toString().padStart(3, '0');

    // Generate the reference ID: cmt-MM-YYYY-XXX
    const referenceId = `CMT-${monthYear}-${count}`;

    // Add the reference ID to the project data
    projectData.referenceId = referenceId;

    // Create and save the new project with the generated reference ID
    const project = new Project(projectData);
    return await project.save();
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
