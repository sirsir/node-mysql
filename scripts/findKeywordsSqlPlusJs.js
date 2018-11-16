var fs = require('fs')
    , es = require('event-stream');

    const clipboardy = require('clipboardy');
// import copy from 'copy-to-clipboard';

const mysql      = require('mysql');


const config =  {
  host     : '192.168.1.18',
  user     : 'mysqladmin',
  password : 'Password@1',
  database : 'amivoice_data_storage',
  multipleStatements: true
}



// === Wrapper to use mysql with Promise
class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}
 
const connection = new Database(config)

 
var countdown = 300; 

const data={
  keywords: [
            /จ่าย *ขั้น *ต่ำ/
            ],
  keywords_except: [
            ]
}

// const data={
//   keywords: [
//             /ปิด *บัญชี/
//             ],
//   keywords_except: [
//             ]
// }

// const data={
//   keywords: [
//             /ขอ *ทราบ *เบอร์ *มือถือ/
//             ],
//   keywords_except: [
//             ]
// }

// const data={
//   keywords: [
//             /ทำ *งาน *ที่ *ไหน/
//             ],
//   keywords_except: [
//             ]
// }

const task={
  streams: {
    imported:{},
    importedFail:{}
  },
  openFiles: function() {
    this.streams.output = fs.createWriteStream('outputs/output.csv');
    // this.streams.importedFail = fs.createWriteStream('outputs/elasticsearch_imported_FAIL.txt');
  },
  closeFiles: function() {
    this.streams.output.end();
    // this.streams.importedFail.end();
  },
  // sample: function(){
  //   connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  //     if (error) throw error;
  //     console.log('The solution is: ', results[0].solution);
  //   })
  // },
  // test: function(){
  //   let tags =  data.tags2

  //   task.joinTags4SQL_tableLike(tags)
  //   .then(tags4sql=>{
  //     console.log(tags4sql)
  //       // connection.query(`SELECT name FROM tags WHERE name IN ${tags4sql}`)

  //     }
  //   )
  //   // .then(namesExist=>{
  //   //   namesOnly = namesExist.map(n=>n.name)
  //   //   console.log(namesOnly)
  //   //   return tags.filter(tag=>{
  //   //     return namesOnly.indexOf(tag) === -1
  //   //   })
  //   // })
  //   // .then(namesNotExist=>{
  //   //   console.log(namesNotExist)
  //   //   return namesNotExist.map(tag=>{
  //   //     return `INSERT INTO tags (name,created_at,updated_at,parent_id) VALUES ('${tag}',NOW(),NOW(),0);`
  //   //   })
  //   //   .join("\n")      
  //   // })
  //   // .then(sql=>{
  //   //   console.log(sql)
  //   //   connection.query(sql)
  //   //   .then(result=>
  //   //     console.log(result)
  //   //   )      
  //   // })
  //   .catch(err=>
  //     console.log(err)
  //   )      
  // },
  // joinTags4SQL: function (tags){
  //   return new Promise(function(resolve, reject) {
  //     try{
  //       str = tags.map(tag=>`'${tag}'`)
  //       .join(',')

  //       str = `(${str})`

  //       resolve(str)
  //     }catch (e){
  //       reject(e)
  //     }
  //   })
    
  // },
  // joinTags4SQL_tableLike: function (tags){
  //   return new Promise(function(resolve, reject) {
  //     try{
  //       let str = tags.map(tag=>`SELECT '${tag}' tag`)
  //       .join(' UNION ')

  //       str = `
  //         INSERT INTO tags (name,created_at,updated_at,parent_id)
  //         SELECT tag,NOW(),NOW(),0 FROM (${str}) a
  //         LEFT JOIN tags t ON a.tag=t.name
  //         WHERE name=NULL
  //       `

  //       resolve(str)
  //     }catch (e){
  //       reject(e)
  //     }
  //   })
    
  // },
  // insertTags: function(){
  //   let tags =  data.tags2

  //   task.joinTags4SQL(tags)
  //   .then(tags4sql=>
  //     connection.query(`SELECT name FROM tags WHERE name IN ${tags4sql}`)
  //   )
  //   .then(namesExist=>{
  //     namesOnly = namesExist.map(n=>n.name)
  //     console.log(namesOnly)
  //     return tags.filter(tag=>{
  //       return namesOnly.indexOf(tag) === -1
  //     })
  //   })
  //   .then(namesNotExist=>{
  //     console.log(namesNotExist)
  //     return namesNotExist.map(tag=>{
  //       return `INSERT INTO tags (name,created_at,updated_at,parent_id) VALUES ('${tag}',NOW(),NOW(),0);`
  //     })
  //     .join("\n")      
  //   })
  //   .then(sql=>{
  //     console.log(sql)
  //     connection.query(sql)
  //     .then(result=>
  //       console.log(result)
  //     )      
  //   })
  //   .catch(err=>
  //     console.log(err)
  //   )      
  // },
  // insertTagsMapping: function(){
  //   let mappings = data.mappingFromCern
    
  //   let sql = mappings.map(mapping=>{
  //     return `INSERT INTO tag_mappings (tag_name,tag_id,created_at,updated_at) VALUES ('${mapping.word}',(SELECT id FROM tags WHERE name='${mapping.words[0]}'),NOW(),NOW());`
  //   })
  //   .join("\n")
  //   console.log(sql)

  //   connection.query(sql)
  //   .then(result=>
  //     console.log(result)
  //   )      
  //   .catch(err=>
  //     console.log(err)
  //   )      
  // },
  // getSql_new_keywords_type: function (){
  //   // keywords = data.keywords.map(function(k){return k[2]})
  //   return new Promise(function(resolve, reject) {
  //     try{
  //       let str = data.keywords.map(arr=>`SELECT '${arr[2]}' name, '${arr[3]}' notify_flag`)
  //       .join(' UNION ')

  //       str = `
  //         INSERT INTO keyword_types (name,notify_flag,created_at,updated_at)
  //         SELECT a.name,a.notify_flag,NOW(),NOW() FROM (${str}) a
  //         WHERE a.name NOT IN (SELECT name FROM keyword_types)
  //       `

  //       console.log(str)

  //       resolve(str)
  //     }catch (e){
  //       reject(e)
  //     }
  //   })
    
  // },
  // getSql_new_keywords: function (){
  //   // keywords = data.keywords.map(function(k){return k[2]})
  //   return new Promise(function(resolve, reject) {
  //     try{
  //       let str = data.keywords.map(arr=>`SELECT '${arr[1]}' name, '${arr[3]}' notify_flag,(SELECT id FROM keyword_types WHERE name='${arr[2]}') keyword_type_id`)
  //       .join(' UNION ')

  //       str = `
  //         INSERT INTO keywords (name,notify_flag,created_at,updated_at,keyword_type_id)
  //         SELECT a.name,a.notify_flag,NOW(),NOW(),keyword_type_id FROM (${str}) a
  //         WHERE a.name NOT IN (SELECT name FROM keywords)
  //       `

  //       console.log(str)

  //       resolve(str)
  //     }catch (e){
  //       reject(e)
  //     }
  //   })
    
  // },

  isMatch: function(strIn) {
    let match = false

    for(let keyword of data.keywords) {
      // console.log(keyword)
      if (strIn.match(keyword)){
        console.log(strIn)
        match = true;
        break;
      }
    }

    if (match == false){
      return false;
    }

    for(let keyword of data.keywords_except) {
      if (strIn.match(keyword)){
        // console.log(strIn)
        match = false;
        break;
      }
    }

    return match;

  },
  doLoop: function(sql0,counter,step){
    let sql = sql0 + `limit ${counter},${step}`

    if (countdown < 1){
      this.closeFiles()
      return;
    }
      
    connection.query(sql)
    .then(result0=>{
      console.log(`finish getting records: ${counter}`)
      if (result0.length == 0 ){
        connection.close();
        this.closeFiles();
        return;
      }

      // console.log(result)
      let result = result0.filter(r=>{

        if (this.isMatch(r.reference)){
          countdown--;
          console.log('countdown: ',countdown)
          // let path = 
          this.streams.output.write(`${r.reference},${r.start_time},${r.end_time},${r.path}\n`);
          return true;
        }
        
        return false;

      })

      this.doLoop(sql0,counter+step,step)


      // result = result.map(r=>r.id).join(',')



      // // console.log(result)
      // clipboardy.writeSync(result);
      
    })      
    .catch(err=>{
      console.log(err)
      connection.close()
    })   
  },
  run: function (){
    this.openFiles()
    this.streams.output.write(`transcription_text,start,stop,path\n`);
    
    // let sql0 = `
    //   select *
    //   from segments s
    //   JOIN assigned_tasks a
    //   ON a.voice_log_id = s.voice_log_id
    //   WHERE a.status IS NOT NULL AND a.status > 0
    // `

    // select CONCAT(t.play_path,t.path,'/',v.audio_path),s.*
    let sql0 = `
      select CONCAT(t.play_path,'\\\\',v.audio_path) path, s.*
      from segments s
      JOIN assigned_tasks a
      ON a.voice_log_id = s.voice_log_id
      JOIN tasks t
      ON t.id = a.task_id
      JOIN voice_logs v
      ON v.id = s.voice_log_id
      WHERE 
       t.play_path IS NOT NULL
      ORDER BY id DESC
    `

    // limit 0,1000

    let counter = 0;
    let step = 1000;

    this.doLoop(sql0,counter,step)

  },


}


// === Select One ===
// task.test();
// task.insertTags();
// task.insertTagsMapping();

// task.getSql_new_keywords_type();
//task.getSql_new_keywords();
// task.getCompareColumns();
task.run();

// === End Select ===
 
// connection.end();

// connection.close();


