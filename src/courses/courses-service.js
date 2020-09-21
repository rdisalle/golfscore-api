const CoursesService = {
    getAllCourses(knex) {
      return knex.select('*').from('golfscore_courses');
    },
    insertCourse(knex, newCourse) {
      return knex
        .insert(newCourse)
        .into('golfscore_courses')
        .returning('*')
        .then(rows => {
          return rows[0]
        });
    },
    getById(knex, id) {
      return knex
        .from('golfscore_courses')
        .select('*')
        .where('id', id)
        .first();
    },
    deleteCourse(knex, id) {
      return knex('golfscore_courses')
        .where({ id })
        .delete()
    },
    updateCourse(knex, id, newCourseFields) {
      return knex('golfscore_courses')
        .where({ id })
        .update(newCourseFields);
    },
  };
  
  module.exports = CoursesService;