const express = require('express');
const router = express.Router();
const projectService = require('../services/projectServices'); // Assuming you have a projectService to handle database operations

// 📌 [POST] Create new project
router.post('/newProject', async (req, res) => {
  try {
    const project = await projectService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: err.message
    });
  }
});

// 📌 [GET] Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await projectService.findAll();
    res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      data: projects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: err.message
    });
  }
});

// 📌 [GET] Get a single project
router.get('/:id', async (req, res) => {
  try {
    const project = await projectService.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Project fetched successfully',
      data: project
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: err.message
    });
  }
});

// Get all projects assigned to a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const projects = await projectService.findByUserId(req.params.userId);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 [PUT] Update project details
router.put('/updateProject/:id', async (req, res) => {
  try {
    const updatedProject = await projectService.update(req.params.id, req.body);
    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: err.message
    });
  }
});

// 📌 [PUT] Assign a user to a project
router.put('/assignUser/:projectId', async (req, res) => {
  try {
    const { assignedTo, deadline } = req.body;

    const updatedProject = await projectService.assignToUser(
      req.params.projectId,
      assignedTo,
      deadline
    );

    res.status(200).json({
      success: true,
      message: 'User assigned to project successfully',
      data: updatedProject // This matches what frontend expects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to assign user to project',
      error: err.message
    });
  }
});

// 📌 [POST] Add a note to a project
router.post('/addNote/:projectId', async (req, res) => {
  try {
    const updatedProject = await projectService.addNoteToProject(req.params.projectId, req.body);
    res.status(201).json({
      success: true,
      message: 'Note added to project successfully',
      data: updatedProject
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to add note to project',
      error: err.message
    });
  }
});

// 📌 [GET] Get all notes for a specific project
router.get('/getNotes/:projectId', async (req, res) => {
  try {
    const notes = await projectService.getNotes(req.params.projectId);
    res.status(200).json({
      success: true,
      message: 'Notes fetched successfully',
      data: notes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
      error: err.message
    });
  }
});

// 📌 [DELETE] Delete a note from a project
router.delete('/deleteNote/:projectId/:noteId', async (req, res) => {
  try {
    const updatedProject = await projectService.deleteNoteFromProject(req.params.projectId, req.params.noteId);
    res.status(200).json({
      success: true,
      message: 'Note deleted from project successfully',
      data: updatedProject
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete note from project',
      error: err.message
    });
  }
});

// 📌 [DELETE] Delete project
router.delete('/deleteProject/:id', async (req, res) => {
  try {
    const deletedProject = await projectService.delete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: err.message
    });
  }
});

// 📌 [PUT] Update project status
router.put('/updateStatus/:projectId', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedProject = await projectService.updateStatus(req.params.projectId, status);
    
    res.status(200).json({
      success: true,
      message: 'Project status updated successfully',
      data: updatedProject
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project status',
      error: err.message
    });
  }
});

// Add credential to project
router.post('/addCredential/:projectId', async (req, res) => {
  try {
    const { type, name, value } = req.body;
    const project = await projectService.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Initialize credentials array if it doesn't exist
    if (!project.credentials) {
      project.credentials = [];
    }

    const newCredential = {
      type,
      name,
      value,
      dateAdded: new Date()
    };

    project.credentials.push(newCredential);
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Credential added successfully',
      data: project
    });
  } catch (error) {
    console.error('Error adding credential:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding credential',
      error: error.message
    });
  }
});

// Update completion date
router.put('/updateCompletionDate/:projectId', async (req, res) => {
  try {
    const { completionDate } = req.body;
    const project = await projectService.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.completionDate = completionDate;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Completion date updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Error updating completion date:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating completion date',
      error: error.message
    });
  }
});

// Update renewal date
router.put('/updateRenewalDate/:projectId', async (req, res) => {
  try {
    const { renewalDate } = req.body;
    const project = await projectService.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.renewalDate = renewalDate;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Renewal date updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Error updating renewal date:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating renewal date',
      error: error.message
    });
  }
});

module.exports = router;
