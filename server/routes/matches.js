const express = require('express');

const router = express.Router();
const Match = require('../models/Match');
const Utilities = require('./database');

/**
 * Gets all matches
 */
router.get('/matches', async (req, res) => {
  try {
    const matches = await Match.find();

    res.send(matches);
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
 * Gets a single match
 */
router.get('/matches/:id', async (req, res) => {
  try {
    /*
    we use findOne over findById as query middleware (necessary for pre hook
    population (see Match.js)) is unsupported for findById
     */
    const match = await Match.findOne({ _id: req.params.id });

    res.send(match);
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
 * Gets match associated with a user
 */
router.get('/matches/users/:userID', async (req, res) => {
  try {
    const match = await Match.findOne({
      $or: [
        { user1: req.params.userID }, { user2: req.params.userID }],
    });

    res.send(match);
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
 * Adds a match
 * If either user1 or user2 are already in a match, no changes will be made
 * Request body must contain the following fields:
 * {
 *   user1ID: <insert-id-here>,
 *   user2ID: <insert-id-here>
 * }
 */
router.post('/matches', async (req, res) => {
  try {
    const user1Match = await Match.findOne({
      $or: [
        { user1: req.body.user1ID }, { user2: req.body.user1ID }],
    });

    const user2Match = await Match.findOne({
      $or: [
        { user1: req.body.user2ID }, { user2: req.body.user2ID }],
    });

    if (user1Match || user2Match) {
      res.end();
      return;
    }

    await Utilities.generateMatch(req.body.user1ID, req.body.user2ID);
    const match = await Match.findOne({ user1: req.body.user1ID });
    res.send(match);
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

router.patch('/matches/:id', async (req, res) => {
  try {
    const match = await Match.findOne({ _id: req.params.id });

    if (!match) {
      res.status(400);
      res.send({
        type: 'https://forcesgame.com/probs/missing-resource',
        title: 'Resource to update missing',
      });
    }

    if (req.body.currentTurn) {
      match.currentTurn = req.body.currentTurn;
    }

    await match.save();

    /*
    we use findOne over findById as query middleware (necessary for pre hook
    population (see Tile.js)) is unsupported for findById
     */
    res.send(await Match.findOne({ _id: req.params.id }));
  } catch (error) {
    res.status(400);
    res.send({
      type: 'https://forcesgame.com/probs/unspecified-problem',
      title: 'Unspecified problem',
      error,
    });
  }
});

module.exports = router;
