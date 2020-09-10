const knex = require('knex')
const app = require('../src/app')
const { makeScoresArray, makeMaliciousScore } = require('./scores.fixtures')
const { makeCoursesArray } = require('./courses.fixtures')

describe('Scores Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
      })

      after('disconnect from db', () => db.destroy())
  
      before('clean the table', () => db.raw('TRUNCATE golfscore_courses, golfscore_scores RESTART IDENTITY CASCADE'))
  
      afterEach('cleanup',() => db.raw('TRUNCATE golfscore_courses, golfscore_scores RESTART IDENTITY CASCADE'))

      describe(`GET /api/scores`, () => {
        context(`Given no scores`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/scores')
              .expect(200, [])
          })
        })

        context('Given there are scores in the database', () => {
            const testCourses = makeCoursesArray();
            const testScores = makeScoresArray()

            beforeEach('insert scores', () => {
                return db
                .into('golfscore_courses')
                .insert(testCourses)
                .then(() => {
                  return db
                    .into('golfscore_scores')
                    .insert(testScores)
                })
            })

            it('responds with 200 and all of the scores', () => {
                return supertest(app)
                  .get('/api/scores')
                  .expect(200, testScores)
            })
        })

        context(`Given an XSS attack score`, () => {
            const testCourses = makeCoursesArray();
            const { maliciousScore, expectedScore } = makeMaliciousScore()
      
            beforeEach('insert malicious Score', () => {
              return db
                .into('golfscore_courses')
                .insert(testCourses)
                .then(() => {
                  return db
                    .into('golfscore_scores')
                    .insert([ maliciousScore ])
            })
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                  .get(`/api/scores`)
                  .expect(200)
                  .expect(res => {
                    expect(res.body[0].name).to.eql(expectedScore.name)
                  })
            })
        })
    })

    describe(`GET /api/scores/:score_id`, () => {
        context(`Given no scores`, () => {
          it(`responds with 404`, () => {
            const scoreId = 123456
            return supertest(app)
              .get(`/api/scores/${scoreId}`)
              .expect(404, { error: { message: `Score doesn't exist` } })
          })
        })

        context('Given there are scores in the database', () => {
            const testCourses = makeCoursesArray();
            const testScores = makeScoresArray()
      
            beforeEach('insert scores', () => {
              return db
                .into('golfscore_courses')
                .insert(testCourses)
                .then(() => {
                  return db
                    .into('golfscore_scores')
                    .insert(testScores)
            })
            })

            it('responds with 200 and the specified score', () => {
                const scoreId = 2
                const expectedScore = testScores[scoreId - 1]
                return supertest(app)
                  .get(`/api/scores/${scoreId}`)
                  .expect(200, expectedScore)
              })
          })

          context(`Given an XSS attack score`, () => {
            const testCourses = makeCoursesArray();
            const { maliciousScore, expectedScore } = makeMaliciousScore()
      
            beforeEach('insert malicious score', () => {
              return db
                .into('golfscore_courses')
                .insert(testCourses)
                .then(() => {
                  return db
                    .into('golfscore_scores')
                    .insert([ maliciousScore ])
            })
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                  .get(`/api/scores/${maliciousScore.id}`)
                  .expect(200)
                  .expect(res => {
                    expect(res.body.name).to.eql(expectedScore.name)
                  })
              })
          })
      })

      describe(`POST /api/scores`, () => {
        const testCourses = makeCoursesArray();
        beforeEach('insert malicious score', () => {
          return db
            .into('golfscore_courses')
            .insert(testCourses)
        })

        it(`creates a score, responding with 201 and the new score`, function() {
            this.retries(3)
            const newScore = {
              name: 'Test new score',
              course: 'Test new score course...',
              course_id: 2,
              score_hole_one: '5',
              score_hole_two: '4',
              score_hole_three: '2',
              score_hole_four: '6',
              score_hole_five: '4',
              score_hole_six: '3',
              score_hole_seven: '5',
              score_hole_eight: '4',
              score_hole_nine: '2',
              score_hole_ten: '6',
              score_hole_eleven: '4',
              score_hole_twelve: '3',
              score_hole_thirteen: '5',
              score_hole_fourteen: '4',
              score_hole_fifteen: '2',
              score_hole_sixteen: '6',
              score_hole_seventeen: '4',
              score_hole_eighteen: '3',
              total_score: '80',
              to_par: '+8'
            }
            return supertest(app)
              .post('/api/scores')
              .send(newScore)
              .expect(201)
              .expect(res => {
                expect(res.body.name).to.eql(newScore.name)
                expect(res.body.course).to.eql(newScore.course)
                expect(res.body.course_id).to.eql(newScore.course_id)
                expect(res.body.score_hole_one).to.eql(newScore.score_hole_one)
                expect(res.body.score_hole_two).to.eql(newScore.score_hole_two)
                expect(res.body.score_hole_three).to.eql(newScore.score_hole_three)
                expect(res.body.score_hole_four).to.eql(newScore.score_hole_four)
                expect(res.body.score_hole_five).to.eql(newScore.score_hole_five)
                expect(res.body.score_hole_six).to.eql(newScore.score_hole_six)
                expect(res.body.score_hole_seven).to.eql(newScore.score_hole_seven)
                expect(res.body.score_hole_eight).to.eql(newScore.score_hole_eight)
                expect(res.body.score_hole_nine).to.eql(newScore.score_hole_nine)
                expect(res.body.score_hole_ten).to.eql(newScore.score_hole_ten)
                expect(res.body.score_hole_eleven).to.eql(newScore.score_hole_eleven)
                expect(res.body.score_hole_twelve).to.eql(newScore.score_hole_twelve)
                expect(res.body.score_hole_thirteen).to.eql(newScore.score_hole_thirteen)
                expect(res.body.score_hole_fourteen).to.eql(newScore.score_hole_fourteen)
                expect(res.body.score_hole_fifteen).to.eql(newScore.score_hole_fifteen)
                expect(res.body.score_hole_sixteen).to.eql(newScore.score_hole_sixteen)
                expect(res.body.score_hole_seventeen).to.eql(newScore.score_hole_seventeen)
                expect(res.body.score_hole_eighteen).to.eql(newScore.score_hole_eighteen)
                expect(res.body.total_score).to.eql(newScore.total_score)
                expect(res.body.to_par).to.eql(newScore.to_par)
                expect(res.body).to.have.property('id')
                expect(res.headers.location).to.eql(`/api/scores/${res.body.id}`)
                const expected = new Date().toLocaleString()
                const actual = new Date(res.body.date_modified).toLocaleString()
                expect(actual).to.eql(expected)
              })
              .then(res =>
                supertest(app)
                  .get(`/api/scores/${res.body.id}`)
                  .expect(res.body)
              )
        })

        const requiredFields = ['name', 'course', 'score_hole_one', 'score_hole_two', 'score_hole_three',
        'score_hole_four', 'score_hole_five', 'score_hole_six', 'score_hole_seven', 'score_hole_eight', 
        'score_hole_nine', 'score_hole_ten', 'score_hole_eleven', 'score_hole_twelve', 'score_hole_thirteen',
        'score_hole_fourteen', 'score_hole_fifteen', 'score_hole_sixteen', 'score_hole_seventeen', 
        'score_hole_eighteen', 'total_score', 'to_par']

        requiredFields.forEach(field => {
            const newScore = {
              name: 'Test new score',
              course: 'Test new score course...',
              course_id: 2,
              score_hole_one: '5',
              score_hole_two: '4',
              score_hole_three: '2',
              score_hole_four: '6',
              score_hole_five: '4',
              score_hole_six: '3',
              score_hole_seven: '5',
              score_hole_eight: '4',
              score_hole_nine: '2',
              score_hole_ten: '6',
              score_hole_eleven: '4',
              score_hole_twelve: '3',
              score_hole_thirteen: '5',
              score_hole_fourteen: '4',
              score_hole_fifteen: '2',
              score_hole_sixteen: '6',
              score_hole_seventeen: '4',
              score_hole_eighteen: '3',
              total_score: '80',
              to_par: '+8'
            }

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            delete newScore[field]
      
            return supertest(app)
                .post('/api/scores')
                .send(newScore)
                .expect(400, {
                  error: { message: `Missing '${field}' in request body` }
                })
            })
        })

        it('removes XSS attack content from response', () => {
            const { maliciousScore, expectedScore } = makeMaliciousScore()
            return supertest(app)
              .post(`/api/scores`)
              .send(maliciousScore)
              .expect(201)
              .expect(res => {
                expect(res.body.name).to.eql(expectedScore.name)
              })
        })
    })

    describe(`DELETE /api/scores/:score_id`, () => {
        context(`Given no scores`, () => {
          it(`responds with 404`, () => {
            const scoreId = 123456
            return supertest(app)
              .delete(`/api/scores/${scoreId}`)
              .expect(404, { error: { message: `Score doesn't exist` } })
          })
        })

        context('Given there are scores in the database', () => {
            const testCourses = makeCoursesArray();
            const testScores = makeScoresArray()
      
            beforeEach('insert scores', () => {
              return db
                .into('golfscore_courses')
                .insert(testCourses)
                .then(() => {
                  return db
                    .into('golfscore_scores')
                    .insert(testScores)
                })
            })

            it('responds with 204 and removes the score', () => {
                const idToRemove = 2
                const expectedScores = testScores.filter(score => score.id !== idToRemove)
                return supertest(app)
                  .delete(`/api/scores/${idToRemove}`)
                  .expect(204)
                  .then(res =>
                    supertest(app)
                      .get(`/api/scores`)
                      .expect(expectedScores)
                  )
              })
        })
    })

    describe(`PATCH /api/scores/:score_id`, () => {
        context(`Given no scores`, () => {
          it(`responds with 404`, () => {
            const scoreId = 123456
            return supertest(app)
              .patch(`/api/scores/${scoreId}`)
              .expect(404, { error: { message: `Score doesn't exist` } })
          })
        })

        context('Given there are scores in the database', () => {
            const testCourses = makeCoursesArray()
            const testScores = makeScoresArray();
            beforeEach('insert scores', () => {
              return db
                .into('golfscore_courses')
                .insert(testCourses)
                .then(() => {
                  return db
                    .into('golfscore_scores')
                    .insert(testScores)
                })
            })

            it('responds with 204 and updates the score', () => {
                const idToUpdate = 2
                const updateScore = {
                  name: 'updated score name',
                  course: 'updated score course',
                  course_id: 2,
                  score_hole_one: '5',
                  score_hole_two: '4',
                  score_hole_three: '2',
                  score_hole_four: '6',
                  score_hole_five: '4',
                  score_hole_six: '3',
                  score_hole_seven: '5',
                  score_hole_eight: '4',
                  score_hole_nine: '2',
                  score_hole_ten: '6',
                  score_hole_eleven: '4',
                  score_hole_twelve: '3',
                  score_hole_thirteen: '5',
                  score_hole_fourteen: '4',
                  score_hole_fifteen: '2',
                  score_hole_sixteen: '6',
                  score_hole_seventeen: '4',
                  score_hole_eighteen: '3',
                  total_score: '80',
                  to_par: '+8'
                }
                const expectedScore = {
                  ...testScores[idToUpdate - 1],
                  ...updateScore
                }
              return supertest(app)
                .patch(`/api/scores/${idToUpdate}`)
                .send(updateScore)
                .expect(204)
                .then(res =>
                  supertest(app)
                    .get(`/api/scores/${idToUpdate}`)
                    .expect(expectedScore)
                 )
            })

            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2
                  return supertest(app)
                    .patch(`/api/scores/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                      error: {
                        message: `Request body must contain all relevent information`
                      }
                    })
            })

            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateScore = {
                  name: 'updated score name',
                }
                const expectedScore = {
                  ...testScores[idToUpdate - 1],
                  ...updateScore
                }
                return supertest(app)
                  .patch(`/api/scores/${idToUpdate}`)
                  .send({
                    ...updateScore,
                    fieldToIgnore: 'should not be in GET response'
                  })
                  .expect(204)
                  .then(res =>
                    supertest(app)
                      .get(`/api/scores/${idToUpdate}`)
                      .expect(expectedScore)
                  )
              })
          })
        })
      })

