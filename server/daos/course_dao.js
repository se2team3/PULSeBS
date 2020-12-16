// import database
// import modules

const db = require('../db/db.js');
/*const Course = require('../models/course.js');

const createCourse = function (row){
    return new Course(row.id,row.code,row.name,row.teacher_id);
}
*/
// it creates the course table
exports.createCourseTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Courses (id INTEGER NOT NULL PRIMARY KEY, code TEXT NOT NULL UNIQUE,
                     name TEXT NOT NULL, teacher_id INTEGER NOT NULL, year INTEGER NOT NULL, semester INTEGER NOT NULL, FOREIGN KEY(teacher_id) REFERENCES Users(id))`
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);
        });
    })
}

//clears the lecture table
exports.clearCourseTable = function () {
    return new Promise ((resolve,reject) =>{
        const sql = 'DELETE FROM Courses';
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve();
        });
    })
}

//it allows you to insert a new course
exports.insertCourse = function({code,name,teacher_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Courses(code,name,teacher_id) VALUES(?,?,?)'
        db.run(sql,[code,name,teacher_id],function(err){
            if(err)
                reject(err);
            else
                resolve(this.lastID);   
        });
    })
}
/*
//gets the course with the selected id
exports.retrieveCourse = function(id) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT * FROM Courses WHERE id = ?'
        db.get(sql, [id], (err, row) => {
            if(err)
                return reject(err);
            if (!row)
                resolve(null);
            else{
                const course = createCourse(row);
                resolve(course);
            }
                
        });
    })
}
*//*
exports.deleteCourseTable = function() {
    return new Promise ((resolve,reject) =>{
        const sql = 'DROP TABLE Courses'
        db.run(sql, (err, row) => {
            if(err)
                return reject(err);
            else resolve(null);
        });
    })
}*/

exports.bulkInsertionCourses = function(array){
    return new Promise ((resolve,reject) =>{
        let sql='';
        //let parametro =''
        //let param=''
    for (let i = 0; i < array.length; i++) {
       // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@",typeof(array[i].name))
      //  param = array[i].name.toString().replace(`'`, ' ')
      //  parametro = param.toString().replace(/'|’/g,"")

      //id INTEGER NOT NULL PRIMARY KEY, code TEXT NOT NULL UNIQUE,
      //name TEXT NOT NULL, teacher_id INTEGER NOT NULL, year INTEGER NOT NULL, semester INTEGER NOT NULL, FOREIGN KEY(teacher_id) REFERENCES Users(id))
      sql += `INSERT INTO Courses(code,name,teacher_id,year,semester) 
      VALUES('${array[i].code}','${array[i].name}',${array[i].teacher_id},${array[i].year},${array[i].semester}); `
    }
    //console.log(parametri)
    db.exec("BEGIN TRANSACTION; "+ sql + " COMMIT;",(err) => {
        if(err)
            reject(err);
    })    
    
    db.all("SELECT code, id FROM Courses",[],(err,rows)=>{
        if(err)
            reject(err)
        else
            resolve(rows)
    })
    
    });
} 
`Metodi di finanziamento delle imprese Chimica Informatica Fisica I Algebra lineare e geometria Economia e organizzazione 
aziendale Economia e organizzazione aziendale Analisi matematica II Analisi matematica II Basi di dati Basi di dati Fisica II
 Fisica II Statistica Statistica Economia e organizzazione aziendale Economia e organizzazione aziendale Ricerca operativa Ricerca 
 operativa Sistemi di produzione Sistemi di produzione Sistemi elettrici industriali Sistemi elettrici industriali Imprenditorialit� 
 e innovazione Strumenti dell'ingegneria per l'Industria 4.0 Elementi di diritto privato Elementi di diritto privato Sistemi telematici
  Programmazione e gestione della produzione Programmazione a oggetti Impianti industriali Programmazione e controllo della produzione 
  Tecnologia dei materiali Logistica di distribuzione Sistemi energetici industriali Progettazione di servizi web e reti di calcolatori 
  Tecniche di programmazione Analisi dei sistemi economici Analisi dei sistemi economici Economia aziendale Economia aziendale Sistemi 
  informativi aziendali Sistemi informativi aziendali Analisi e gestione dei sistemi produttivi Analisi e gestione dei sistemi produttivi
   Economia dei sistemi industriali Economia dei sistemi industriali Strategia e organizzazione Strategia e organizzazione Diritto commerciale 
   Diritto commerciale Economia e finanza d'impresa Economia e finanza d'impresa Gestione dei progetti Gestione dei progetti Ingegneria della qualit� 
   Ingegneria della qualit� Gestione dell'innovazione e sviluppo prodotto ICT Business intelligence per Big Data Mercati, rischi e strumenti finanziari 
   Metodi di finanziamento delle imprese `