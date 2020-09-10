const ScoresService = {
    getAllScores(knex) {
      return knex.select('*').from('golfscore_scores')
    },
    insertScore(knex, newScore) {
      return knex
        .insert(newScore)
        .into('golfscore_scores')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex
        .from('golfscore_scores')
        .select('*')
        .where('id', id)
        .first()
    },
    deleteScore(knex, id) {
      return knex('golfscore_scores')
        .where({ id })
        .delete()
    },
    updateScore(knex, id, newScoreFields) {
      return knex('golfscore_scores')
        .where({ id })
        .update(newScoreFields)
    },
  }
  
  module.exports = ScoresService