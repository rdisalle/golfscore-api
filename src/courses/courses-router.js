const path = require('path')
const express = require('express')
const xss = require('xss')
const CoursesService = require('./courses-service')

const coursesRouter = express.Router()
const jsonParser = express.json()

const serializeCourse = course => ({
    id: course.id,
    name: xss(course.name),
    location: course.location,
    course_distance: course.course_distance,
    course_par: course.course_par,
    course_par_hole_one: course.course_par_hole_one,
    course_par_hole_two: course.course_par_hole_two,
    course_par_hole_three: course.course_par_hole_three,
    course_par_hole_four: course.course_par_hole_four,
    course_par_hole_five: course.course_par_hole_five,
    course_par_hole_six: course.course_par_hole_six,
    course_par_hole_seven: course.course_par_hole_seven,
    course_par_hole_eight: course.course_par_hole_eight,
    course_par_hole_nine: course.course_par_hole_nine,
    course_par_hole_ten: course.course_par_hole_ten,
    course_par_hole_eleven: course.course_par_hole_eleven,
    course_par_hole_twelve: course.course_par_hole_twelve,
    course_par_hole_thirteen: course.course_par_hole_thirteen,
    course_par_hole_fourteen: course.course_par_hole_fourteen,
    course_par_hole_fifteen: course.course_par_hole_fifteen,
    course_par_hole_sixteen: course.course_par_hole_sixteen,
    course_par_hole_seventeen: course.course_par_hole_seventeen,
    course_par_hole_eighteen: course.course_par_hole_eighteen,
    course_summary: course.course_summary,
    course_url: course.course_url,
  })

coursesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    CoursesService.getAllCourses(knexInstance)
      .then(courses => {
        res.json(courses.map(serializeCourse))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const addCourse = req.body
    const newCourse = addCourse

    for (const [key, value] of Object.entries(newCourse))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    CoursesService.insertCourse(
      req.app.get('db'),
      newCourse
    )
      .then(course => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${course.id}`))
          .json(serializeCourse(course))
      })
      .catch(next)
  })

coursesRouter
  .route('/:course_id')
  .all((req, res, next) => {
    CoursesService.getById(
      req.app.get('db'),
      req.params.course_id
    )
      .then(course => {
        if (!course) {
          return res.status(404).json({
            error: { message: `Course doesn't exist` }
          })
        }
        res.course = course
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeCourse(res.course))
  })
  .delete((req, res, next) => {
    CoursesService.deleteCourse(
      req.app.get('db'),
      req.params.course_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const courseUpdate = req.body
    const courseToUpdate = courseUpdate
    const numberOfValues = Object.values(courseToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain '${key}'`
        }
      })
    }

      CoursesService.updateCourse(
        req.app.get('db'),
        req.params.course_id,
        courseToUpdate
      )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
  })

module.exports = coursesRouter