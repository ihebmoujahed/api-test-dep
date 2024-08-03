// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
var db = require("../database-pg");

////////////////////////////////////////////////////////////////////////////////////////////////
const addTeacher = function (req, res) {
  var cond = req.body;
  var insert = `INSERT INTO teacher  (nom ,prenom ,numerotlf,cardid,subject)values('${cond.nom}','${cond.prenom}','${cond.numerotlf}','${cond.cardid}','${cond.subject}')`;
  db.query(insert, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};
const addClasses = function (req, res) {
  const { groupNumber, TeacherName, subject } = req.body;

  // Step 1: Query to get teacher_id
  const getTeacherIdQuery = `
    SELECT id 
    FROM teacher 
    WHERE nom = $1 AND subject = $2
  `;

  // Step 2: Find teacher_id
  db.query(getTeacherIdQuery, [TeacherName, subject], (err, result) => {
    if (err) {
      console.error("Error fetching teacher ID:", err);
      res.status(500).send("Error fetching teacher ID");
      return;
    }

    if (result.rows.length === 0) {
      res.status(404).send("Teacher not found or subject mismatch");
      return;
    }

    const teacher_id = result.rows[0].id;

    // Step 3: Insert new class
    const insertQuery = `
      INSERT INTO Classes (groupNumber, teacher_id, subject)
      VALUES ($1, $2, $3)
    `;

    db.query(insertQuery, [groupNumber, teacher_id, subject], (err, result) => {
      if (err) {
        console.error("Error inserting class:", err);
        res.status(500).send("Error inserting class");
      } else {
        res.send("Class added successfully");
      }
    });
  });
};
const addClasseStd = function (req, res) {
  const { studentId, groupNumber, teacherId } = req.body;

  // Ensure these IDs are valid and exist in the database before inserting.
  const insertQuery = `
    INSERT INTO Classelist (student_id, groupNumber, teacher_id)
    VALUES ($1, $2, $3)
  `;

  const values = [studentId, groupNumber, teacherId];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.send(result);
    }
  });
};

const ClassesList = function (req, res) {
  const { teacher_id, groupnumber } = req.params;
  const query =
  `SELECT s.nom AS studentnom, s.prenom AS studentprenom, s.id AS student_id 
  FROM Classelist cl
  JOIN student s ON cl.student_id = s.id
  WHERE cl.teacher_id = $1 AND cl.groupNumber = $2`;
  const values = [teacher_id, groupnumber];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error fetching class list:", err);
      res.status(500).send("Error retrieving class list");
    } else {
      res.json(result.rows);
    }
  });
};

const getTeachers = function (req, res) {
  var select = "select * from teacher";
  db.query(select, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};
const getClasses = function (req, res) {
  const selectQuery = `
    SELECT
      c.id,
      c.groupNumber AS groupnumber,
      t.nom AS teachername,
      c.subject
    FROM
      Classes c
    JOIN
      teacher t ON c.teacher_id = t.id
  `;

  db.query(selectQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.send(result.rows); // Make sure to send only the rows
    }
  });
};
const classeinformation = function (req, res) {
  var select = `select * from Classes where id =${req.params.id}`;
  db.query(select, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////////
const addStudent = function (req, res) {
  var cond = req.body;
  var insert = `INSERT INTO student  (nom ,prenom ,numerotlfparent
     ,cardid)values('${cond.nom}','${cond.prenom}','${cond.numerotlfparent}','${cond.cardid}')`;
  db.query(insert, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};
const PresenceStd = function (req, res) {
  const attendanceRecords = req.body;

  // Construct a parameterized query
  const query = `
    INSERT INTO Presence (student_id, class_id, date, is_present)
    VALUES ${attendanceRecords
      .map(
        (_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
      )
      .join(", ")}
  `;

  // Flatten the array for parameterized query
  const values = attendanceRecords.flatMap((record) => [
    record.student_id,
    record.class_id,
    record.date,
    record.is_present,
  ]);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).send("Error recording attendance");
    } else {
      res.send("Attendance recorded successfully");
    }
  });
};

const getStudent = function (req, res) {
  var select = "select * from student";
  db.query(select, (err, result) => {
    if (err) {
      c;
      onsole.error(err);
    } else {
      res.send(result);
    }
  });
};
const getStudentbyId = function (req, res) {
  var select = `select * from student where id =${req.params.id}`;
  db.query(select, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};

module.exports = {
  addTeacher,
  getTeachers,
  addStudent,
  getStudent,
  getStudentbyId,
  addClasses,
  getClasses,
  ClassesList,
  classeinformation,
  addClasseStd,
  PresenceStd,
};
