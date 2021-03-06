function makeScoresArray() {
    return [
        {
            id: 1,
            name: "Test score one",
            course_id: 1,
            score_hole_one: "6",
            score_hole_two: "5",
            score_hole_three: "3",
            score_hole_four: "4",
            score_hole_five: "5",
            score_hole_six: "6",
            score_hole_seven: "4",
            score_hole_eight: "5",
            score_hole_nine: "2",
            score_hole_ten: "6",
            score_hole_eleven: "3",
            score_hole_twelve: "5",
            score_hole_thirteen: "5",
            score_hole_fourteen: "4",
            score_hole_fifteen: "4",
            score_hole_sixteen: "3",
            score_hole_seventeen: "5",
            score_hole_eighteen: "5",
            total_score: "80",
            to_par: "+8",
            date_modified: "2020-01-22T16:28:32.615Z"
        },
        {
            id: 2,
            name: "Test score two",
            course_id: 2,
            score_hole_one: "6",
            score_hole_two: "5",
            score_hole_three: "3",
            score_hole_four: "4",
            score_hole_five: "5",
            score_hole_six: "6",
            score_hole_seven: "4",
            score_hole_eight: "5",
            score_hole_nine: "2",
            score_hole_ten: "6",
            score_hole_eleven: "3",
            score_hole_twelve: "5",
            score_hole_thirteen: "5",
            score_hole_fourteen: "4",
            score_hole_fifteen: "4",
            score_hole_sixteen: "3",
            score_hole_seventeen: "5",
            score_hole_eighteen: "5",
            total_score: "80",
            to_par: "+8",
            date_modified: "2020-01-22T16:28:32.615Z"
        },
        {
            id: 3,
            name: "Test score three",
            course_id: 3,
            score_hole_one: "6",
            score_hole_two: "5",
            score_hole_three: "3",
            score_hole_four: "4",
            score_hole_five: "5",
            score_hole_six: "6",
            score_hole_seven: "4",
            score_hole_eight: "5",
            score_hole_nine: "2",
            score_hole_ten: "6",
            score_hole_eleven: "3",
            score_hole_twelve: "5",
            score_hole_thirteen: "5",
            score_hole_fourteen: "4",
            score_hole_fifteen: "4",
            score_hole_sixteen: "3",
            score_hole_seventeen: "5",
            score_hole_eighteen: "5",
            total_score: "80",
            to_par: "+8",
            date_modified: "2020-01-22T16:28:32.615Z"
        }
    ];
};

function makeMaliciousScore() {
    const maliciousScore = {
        id: 911,
            name: 'Naughty naughty very naughty <script>alert("xss");</script>',
            course_id: 3,
            score_hole_one: "6",
            score_hole_two: "5",
            score_hole_three: "3",
            score_hole_four: "4",
            score_hole_five: "5",
            score_hole_six: "6",
            score_hole_seven: "4",
            score_hole_eight: "5",
            score_hole_nine: "2",
            score_hole_ten: "6",
            score_hole_eleven: "3",
            score_hole_twelve: "5",
            score_hole_thirteen: "5",
            score_hole_fourteen: "4",
            score_hole_fifteen: "4",
            score_hole_sixteen: "3",
            score_hole_seventeen: "5",
            score_hole_eighteen: "5",
            total_score: "80",
            to_par: "+8",
            date_modified: new Date().toISOString()
    };
    const expectedScore = {
      ...maliciousScore,
      name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    };
    return {
      maliciousScore,
      expectedScore,
    };
  };
  
  module.exports = {
    makeScoresArray,
    makeMaliciousScore,
  };