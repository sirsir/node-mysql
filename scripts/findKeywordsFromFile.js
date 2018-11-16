var fs = require('fs')
    , es = require('event-stream');

    // const clipboardy = require('clipboardy');
// import copy from 'copy-to-clipboard';

const mysql      = require('mysql');


const config =  {
  host     : '192.168.1.18',
  user     : 'mysqladmin',
  password : 'Password@1',
  database : 'amivoice_data_storage',
  multipleStatements: true,
  inputfile: './inputs/input_findKeywordsFromFile.txt',
  outputfile: './outputs/output_findKeywordsFromFile.txt',
  sql_limit: 10
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

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const connection = new Database(config)
 
// const data={
//    max_results: 300,
//    outputPath: 'outputs/ปิดบัญชี.csv',
//    sqlCondition: "(s.reference LIKE '%[!เ]ปิดบัญชี%' OR s.reference LIKE '%[!เ]ปิด บัญชี%')"
// }

// const data={
//    max_results: 300,
//    outputPath: 'outputs/ปิดบัญชี.csv',
//    sqlCondition: "s.reference REGEXP '[^เ]ปิด *บัญชี.*' "
// }

// const data={
//    max_results: 300,
//    outputPath: 'outputs/ขอทราบเบอร์มือถือ.csv',
//    sqlCondition: "s.reference REGEXP 'ขอ *ทราบ *เบอร์ *มือ *ถือ' "
// }

// const data={
//    max_results: 300,
//    outputPath: 'outputs/ทำงานที่ไหน.csv',
//    sqlCondition: "s.reference REGEXP 'ทำ *งาน *ที่ *ไหน' "
// }

const data_array=[
  {
   max_results: 300,
   outputPath: 'outputs/L-จ่ายขั้นต่ำ.csv',
   sqlCondition: "s.reference REGEXP 'จ่าย *ขั้น *ต่ำ' AND s.channel = 'L'"
  },
  {
   max_results: 300,
   outputPath: 'outputs/L-ปิดบัญชี.csv',
   sqlCondition: "s.reference REGEXP '[^เ]ปิด *บัญชี.*' AND s.channel = 'L'"
  },
  {
   max_results: 300,
   outputPath: 'outputs/L-ขอทราบเบอร์มือถือ.csv',
   sqlCondition: "s.reference REGEXP 'ขอ *ทราบ *เบอร์ *มือ *ถือ' AND s.channel = 'L'"
  },
  {
   max_results: 300,
   outputPath: 'outputs/L-ทำงานที่ไหน.csv',
   sqlCondition: "s.reference REGEXP 'ทำ *งาน *ที่ *ไหน' AND s.channel = 'L'"
  },
  {
   max_results: 300,
   outputPath: 'outputs/R-จ่ายขั้นต่ำ.csv',
   sqlCondition: "s.reference REGEXP 'จ่าย *ขั้น *ต่ำ' AND s.channel = 'R'"
  },
  {
   max_results: 300,
   outputPath: 'outputs/R-ปิดบัญชี.csv',
   sqlCondition: "s.reference REGEXP '[^เ]ปิด *บัญชี.*' AND s.channel = 'R'"
  },
  {
   max_results: 300,
   outputPath: 'outputs/R-ขอทราบเบอร์มือถือ.csv',
   sqlCondition: "s.reference REGEXP 'ขอ *ทราบ *เบอร์ *มือ *ถือ' AND s.channel = 'R'"
  },
  {
   max_results: 300,
   outputPath: 'outputs/R-ทำงานที่ไหน.csv',
   sqlCondition: "s.reference REGEXP 'ทำ *งาน *ที่ *ไหน' AND s.channel = 'R'"
  },
]

const task={
  streams: {
    imported:{},
    importedFail:{}
  },
  readFile: async function() {
    return new Promise((resolve,reject) =>{
      fs.readFile(config.inputfile, (err,buf)=>{
        if (err){
          reject(err);
        }
        // console.log(buf.toString('utf8'));

        console.log(buf);
        resolve(buf)
        // resolve(buf.toString('utf8'));
      });
    });
    
  },
  openFiles: function(data) {
    // this.streams.output = fs.createWriteStream(data.outputPath);
    this.streams.output = fs.createWriteStream(config.outputfile);
    // this.streams.importedFail = fs.createWriteStream('outputs/elasticsearch_imported_FAIL.txt');
  },
  closeFiles: function(data) {
    this.streams.output.end();
    console.log(`Finish writing to file: ${config.outputfile}`)
    // this.streams.importedFail.end();
  },
  runEach: async function(data) {
    return new Promise((resolve,reject)=>{
      // this.openFiles(data)
      // this.streams.output.write(`transcription_text,start,stop,path\n`);
      

//       let sql = `
//       SELECT * FROM amivoice_data_storage.segments
// where reference like '%${data}%'
// and channel='L'
// limit ${config.sql_limit}
//       `

      let sql = `
SELECT s.reference FROM amivoice_data_storage.segments s
join amivoice_data_storage.voice_logs v on v.id = s.voice_log_id
join amivoice_data_storage.tasks t on v.task_id = t.id
join amivoice_data_storage.projects p on p.id = t.project_id
where channel = 'L' 
and (p.customer_name = 'AEON COL' or p.customer_name = 'ACSS')
and reference like '%${data}%'
limit ${config.sql_limit}
`

      connection.query(sql)
      .then(result0=>{
        console.log(`finish getting ${result0.length} records for '${data}'`)
        
        let head = data

        

        if (result0.length === 0){
          let strOut = `${head}\tnull\n`.toString('utf8')
          console.log(strOut)
          this.streams.output.write(strOut);

          head=''

          for (let i=1;i<config.sql_limit;i++){
            let strOut = `\tnull\n`.toString('utf8')
            console.log(strOut)
            this.streams.output.write(strOut);
          }
          // console.log(strOut)

          

        } else {
          result0.forEach(r=>{
            let strOut = `${head}\t${r.reference}\n`
            console.log(strOut)

            this.streams.output.write(strOut);
            head=''
            
          })

          for (let i=result0.length;i<config.sql_limit;i++){
            let strOut = `\tnull\n`.toString('utf8')
            console.log(strOut)
            this.streams.output.write(strOut);
          }
        }

        // this.closeFiles(data);

        resolve(1);
        
      })      
      .catch(err=>{
        console.log(err)
        // connection.close()
        reject(err);
      })
      // .then(connection.close)
    })
      
  },
  // runEach: async function(data) {
  //   return new Promise((resolve,reject)=>{
  //     this.openFiles(data)
  //     this.streams.output.write(`transcription_text,start,stop,path\n`);
      

  //     let sql = `
  //       select CONCAT(t.play_path,'\\\\',v.audio_path) path, s.*
  //       from segments s
  //       JOIN assigned_tasks a
  //       ON a.voice_log_id = s.voice_log_id
  //       JOIN tasks t
  //       ON t.id = a.task_id
  //       JOIN voice_logs v
  //       ON v.id = s.voice_log_id
  //       WHERE 
  //        t.play_path IS NOT NULL
  //        AND ${data.sqlCondition}
  //       ORDER BY id DESC
  //       limit 0,${data.max_results}
  //     `

  //     console.log(sql)

  //     connection.query(sql)
  //     .then(result0=>{
  //       console.log(`finish getting ${result0.length} records`)
        
  //       result0.forEach(r=>{
  //         this.streams.output.write(`${r.reference},${r.start_time},${r.end_time},${r.path}\n`);
  //       })

  //       this.closeFiles(data);

  //       resolve(1);
        
  //     })      
  //     .catch(err=>{
  //       console.log(err)
  //       // connection.close()
  //       reject(err);
  //     })
  //     // .then(connection.close)
  //   })
      
  // },
  run: async function (){
    // let data_array = await this.readFile().split(/\n\r?/).filter(el=>{return el.length>0})

    let data_array = fs.readFileSync(config.inputfile).toString('utf8').split(/\n\r?/).filter(el=>{return el.length>0})
    // .split(/\n\r?/).filter(el=>{return el.length>0})
    // data_array=[data_array[1]]
    // console.log(data_array)

    data_array.splice(0,1)
    // data_array.splice(1,5)
    // data_array.splice(0,1)
    this.openFiles('')
    await asyncForEach(data_array, async data=>{
      await this.runEach(data)
    })
    this.closeFiles('')

    connection.close();
    

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


