const path = require('path')
const express = require('express')
const xss = require('xss')
const ScoresService = require('./scores-service')

const scoresRouter = express.Router()
const jsonParser = express.json()

const serializeScore = score => ({
    id: score.id,
    name: xss(score.name),
    course: score.course,
    course_id: score.course_id,
    score_hole_one: score.score_hole_one,
    score_hole_two: score.score_hole_two,
    score_hole_three: score.score_hole_three,
    score_hole_four: score.score_hole_four,
    score_hole_five: score.score_hole_five,
    score_hole_six: score.score_hole_six,
    score_hole_seven: score.score_hole_seven,
    score_hole_eight: score.score_hole_eight,
    score_hole_nine: score.score_hole_nine,
    score_hole_ten: score.score_hole_ten,
    score_hole_eleven: score.score_hole_eleven,
    score_hole_twelve: score.score_hole_twelve,
    score_hole_thirteen: score.score_hole_thirteen,
    score_hole_fourteen: score.score_hole_fourteen,
    score_hole_fifteen: score.score_hole_fifteen,
    score_hole_sixteen: score.score_hole_sixteen,
    score_hole_seventeen: score.score_hole_seventeen,
    score_hole_eighteen: score.score_hole_eighteen,
    total_score: score.total_score,
    to_par: score.to_par,
    date_modified: score.date_modified,
  })
  

scoresRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ScoresService.getAllScores(knexInstance)
      .then(scores => {
        res.json(scores.map(serializeScore))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, course, course_id, score_hole_one, score_hole_two, score_hole_three, score_hole_four, score_hole_five, score_hole_six, score_hole_seven, 
        score_hole_eight, score_hole_nine, score_hole_ten, score_hole_eleven, score_hole_twelve, score_hole_thirteen, score_hole_fourteen, score_hole_fifteen, 
        score_hole_sixteen, score_hole_seventeen, score_hole_eighteen, total_score, to_par } = req.body
    const newScore = { name, course, course_id, score_hole_one, score_hole_two, score_hole_three, score_hole_four, score_hole_five, score_hole_six, score_hole_seven, 
        score_hole_eight, score_hole_nine, score_hole_ten, score_hole_eleven, score_hole_twelve, score_hole_thirteen, score_hole_fourteen, score_hole_fifteen, 
        score_hole_sixteen, score_hole_seventeen, score_hole_eighteen, total_score, to_par  }

    for (const [key, value] of Object.entries(newScore))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    ScoresService.insertScore(
      req.app.get('db'),
      newScore
    )
      .then(score => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${score.id}`))
          .json(serializeScore(score))
      })
      .catch(next)
  })

scoresRouter
  .route('/:score_id')
  .all((req, res, next) => {
    ScoresService.getById(
      req.app.get('db'),
      req.params.score_id
    )
      .then(score => {
        if (!score) {
          return res.status(404).json({
            error: { message: `Score doesn't exist` }
          })
        }
        res.score = score
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeScore(res.score))
  })
  .delete((req, res, next) => {
    ScoresService.deleteScore(
      req.app.get('db'),
      req.params.score_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, course, course_id, score_hole_one, score_hole_two, score_hole_three, score_hole_four, score_hole_five, score_hole_six, score_hole_seven, 
        score_hole_eight, score_hole_nine, score_hole_ten, score_hole_eleven, score_hole_twelve, score_hole_thirteen, score_hole_fourteen, score_hole_fifteen, 
        score_hole_sixteen, score_hole_seventeen, score_hole_eighteen, total_score, to_par } = req.body
    const scoreToUpdate = { name, course, course_id, score_hole_one, score_hole_two, score_hole_three, score_hole_four, score_hole_five, score_hole_six, score_hole_seven, 
        score_hole_eight, score_hole_nine, score_hole_ten, score_hole_eleven, score_hole_twelve, score_hole_thirteen, score_hole_fourteen, score_hole_fifteen, 
        score_hole_sixteen, score_hole_seventeen, score_hole_eighteen, total_score, to_par }
    const numberOfValues = Object.values(scoreToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain all relevent information`
        }
      })
    }

      ScoresService.updateScore(
        req.app.get('db'),
        req.params.score_id,
        scoreToUpdate
      )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
  })

module.exports = scoresRouter