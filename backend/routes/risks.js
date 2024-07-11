const express = require('express');
const { Risk, Users, Project, RiskCategory, Event, Entity, Role, Attachment, MitigationAction, RiskEvaluation} = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all risks
router.get('/risks', authenticate, async (req, res) => {
  try {
    const risks = await Risk.findAll();
    res.status(200).json(risks);
  } catch (error) {
    res.status(400).json({ error: 'Unable to fetch risks' });
  }
});

router.post('/risks', authenticate, async (req, res) => {
  const { description, probability, impact, risk_response, response_strategy, expected_result, status, note, project_id, category_id, new_category, event_description, event_date } = req.body;
  
  try {
    // Create or find the category
    let categoryId = category_id;
    if (new_category) {
      const category = await RiskCategory.create({ name: new_category });
      categoryId = category.id;
    }
    
    // Create the event
    const event = await Event.create({ description: event_description, event_date });

    // Create the risk
    const risk = await Risk.create({
      description,
      probability,
      impact,
      risk_response,
      response_strategy,
      expected_result,
      status,
      note,
      user_id: req.user.id, // Use the authenticated user's ID
      project_id,
      category_id: categoryId,
      triggering_event_id: event.id, // Link the event to the risk
    });

    res.status(201).json(risk);
  } catch (error) {
    console.error('Error creating risk:', error);
    res.status(500).json({ error: 'Failed to create risk' });
  }
});

// Get risk details
router.get('/risks/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const risk = await Risk.findByPk(id, {
      include: [
        {
          model: Users,
          attributes: ['email', 'first_name', 'last_name'],
          include: [
            { model: Entity, attributes: ['description', 'type'] },
            { model: Role, attributes: ['name'] }
          ]
        },
        { model: Project, attributes: ['description', 'start_date', 'end_date', 'status'] },
        { model: RiskCategory, attributes: ['name'] },
        { model: Event, attributes: ['description', 'event_date'] },
        { model: Attachment, attributes: ['file_path'] },
        {
          model: MitigationAction,
          attributes: ['id', 'action_description', 'assigned_to', 'due_date', 'status', 'completed_at', 'created_at'],
          include: [
            {
              model: Users,
              as: 'User',
              attributes: ['id', 'email', 'first_name', 'last_name'],
              include: [
                { model: Entity, attributes: ['description', 'type'] },
                { model: Role, attributes: ['name'] }
              ]
            }
          ]
        },
        {
          model: RiskEvaluation,
          attributes: ['id', 'evaluation_date', 'probability', 'impact', 'score', 'comments', 'created_at'],
          include: [
            {
              model: Users,
              attributes: ['id', 'email', 'first_name', 'last_name'],
              include: [
                { model: Entity, attributes: ['description', 'type'] },
                { model: Role, attributes: ['name'] }
              ]
            }
          ]
        }
      ]
    });
    if (!risk) {
      return res.status(404).json({ error: 'Risk not found' });
    }
    res.json(risk);
  } catch (error) {
    console.error('Error fetching risk details:', error);
    res.status(500).json({ error: 'Failed to fetch risk details' });
  }
});


router.delete('/risks/:id', authenticate, async (req, res) => {
  try {
    const risk = await Risk.findByPk(req.params.id);
    if (!risk) {
      return res.status(404).json({ error: 'Risk not found' });
    }
    await risk.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting risk' });
  }
});

router.get('/riskCategories', async (req, res) => {
  try {
    const categories = await RiskCategory.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching risk categories:', error);
    res.status(500).json({ error: 'Failed to fetch risk categories' });
  }
});

router.get('/projects', authenticate, async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/projects', authenticate, async (req, res) => {
  const { description, start_date, end_date, status } = req.body;

  try {
    const newProject = await Project.create({
      description,
      start_date,
      end_date: end_date || null,
      status
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ error: 'Unable to create project' });
  }
});

router.post('/mitigationActions', authenticate, async (req, res) => {
  const { risk_id, action_description, assigned_to, due_date, status } = req.body;

  try {
    const newMitigationAction = await MitigationAction.create({
      risk_id,
      action_description,
      assigned_to,
      due_date,
      status,
    });

    res.status(201).json(newMitigationAction);
  } catch (error) {
    console.error('Error creating mitigation action:', error);
    res.status(400).json({ error: 'Unable to create mitigation action' });
  }
});

router.post('/risk-evaluations', authenticate, async (req, res) => {
  const { risk_id, evaluation_date, probability, impact, score, comments } = req.body;
  const user_id = req.user.id;

  try {
    // Create the new risk evaluation
    const riskEvaluation = await RiskEvaluation.create({
      risk_id,
      evaluation_date,
      probability,
      impact,
      score,
      comments,
      user_id,
    });

    // Update the risk with the new probability and impact
    await Risk.update(
      { probability, impact },
      { where: { id: risk_id } }
    );

    res.status(201).json(riskEvaluation);
  } catch (error) {
    console.error('Error creating risk evaluation:', error);
    res.status(500).json({ error: 'Failed to create risk evaluation' });
  }
});


module.exports = router;
