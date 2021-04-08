const express = require('express');

const router = express.Router();
const Unit = require('../models/Unit');

/**
 * Gets all Units
 */
router.get('/units', async (req, res) => {
  try {
    res.send(await Unit.find());
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

/**
 * Gets a single Unit associated with an id
 */
router.get('/units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.send(await Unit.findOne({ _id: id }));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

/**
 * Adds a single Unit with a type
 * Request body must contain JSON of the type of the unit to add:
 * {
 *   type: <insert-type-here>
 * }
 */
router.post('/units', async (req, res) => {
  try {
    const { type } = req.body;
    const unit = new Unit({
      type,
    });

    res.send(await unit.save());
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

/**
 * Updates a Unit
 * Request body may contain the new health, new stamina, both, or neither:
 * {
 *   health: <insert-number-here OPTIONAL>,
 *   stamina: <insert-number-here OPTIONAL>
 * }
 */
router.patch('/units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findOne({ _id: id });

    if (req.body.health) {
      unit.health = req.body.health;
    }

    if (req.body.stamina) {
      unit.stamina = req.body.stamina;
    }

    await unit.save();

    res.send(await Unit.findOne({ _id: id }));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

router.get('/units/info/infantry', (req, res) => {
  res.send({
    type: 'INFANTRY',
    rating: '1',
    maxStamina: '3',
    maxHealth: '100',
    strongAgainst: ['BAZOOKA'],
    weakAgainst: ['TANK'],
  });
});

router.get('/units/info/bazooka', (req, res) => {
  res.send({
    type: 'BAZOOKA',
    rating: '2',
    maxStamina: '2',
    maxHealth: '125',
    strongAgainst: ['TANK'],
    weakAgainst: ['INFANTRY'],
  });
});

router.get('/units/info/tank', (req, res) => {
  res.send({
    type: 'TANK',
    rating: '3',
    maxStamina: '1',
    maxHealth: '200',
    strongAgainst: ['INFANTRY'],
    weakAgainst: ['BAZOOKA'],
  });
});

module.exports = router;