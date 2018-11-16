var fs = require('fs')
    , es = require('event-stream');

const clipboardy = require('clipboardy');
// import copy from 'copy-to-clipboard';

const mysql      = require('mysql');


const config =  {
    host     : '192.168.1.50',
    user     : 'mysqladmin',
    password : 'Password@1',
    database : 'aohsdb_dev2',
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
const connection = new Database(config);

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}


 
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


const task={
  streams: {
    imported:{},
    importedFail:{}
  },
  openFiles: function(data) {
    return new Promise((resolve,reject)=>{
      try{
        this.streams.output = fs.createWriteStream(data.outputPath);
        // this.streams.output.write(`transcription_text,start,stop,path\n`);
        setTimeout(()=>{resolve('success')}, 1000)
      } catch (e) {
        reject(e)
      }
      
    })
    
    // this.streams.importedFail = fs.createWriteStream('outputs/elasticsearch_imported_FAIL.txt');
  },
  closeFiles: function(data) {
    return new Promise((resolve,reject)=>{
      try{
        this.streams.output.end();
        console.log(`Finish writing to file: ${data.outputPath}`)
        setTimeout(()=>{resolve('success')}, 1000)
      } catch (e) {
        reject(e)
      }
      
    })
  },
  // runEach: async function(data,ids4random) {
  //   return new Promise((resolve,reject)=>{
  //     // this.openFiles(data)
  //     // this.streams.output.write(`transcription_text,start,stop,path\n`);
  //     let idRandom =  ids4random[Math.floor(Math.random() * ids4random.length)];

  //     let sql = `
  //         insert into voice_log_atlusr_maps (voice_log_id, user_atl_id)

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
  getSqlResults: async function(){
    return new Promise((resolve,reject)=>{

      let sql = `
        SELECT id,ml.voice_log_id, ml.reference_id from message_logs ml
where  ml.created_at BETWEEN '2018-06-07 00:00:00 +0700' AND '2018-07-27 23:59:59 +0700' 
and ml.item_id IS NULL
and ml.message_type = 'Recommendation'
      `

      connection.query(sql)
      .then(result=>{
        // console.log(result)
        resolve(result)
        // connection.close()
      })      
      .catch(err=>{
        console.log(err)
        // connection.close()
      })   
    })
  },
  
  getSqlResults_idsAnswerQuestionsMap: async function(){
    return new Promise((resolve,reject)=>{

      let sql = `
        select faq_question_id,id from faq_answers
        ORDER BY faq_question_id
      `

      connection.query(sql)
      .then(result=>{
        // console.log(result)
        mapOut = {}
        result.forEach(r=>{
          // console.log(r)
          // console.log(r.id)
          if (! mapOut[r.faq_question_id]){
            mapOut[r.faq_question_id] = [r.id]
          }
          else{
            mapOut[r.faq_question_id].push(r.id)
          }
          // console.log(mapOut)

        }) 

        // Object.keys(mapOut).forEach(k=>{
        //   mapOut[k] = mapOut[k].uniq
        // })

        resolve(mapOut)
        // connection.close()
      })      
      .catch(err=>{
        console.log(err)
        // connection.close()
      })   
    })
  },
  // filterResults: function(result0){
  //   return new Promise((resolve,reject)=>{
  //     let result = result0.filter(r=>{
  //       let first23digit = r.dnis.slice(1,4)

  //       if (first23digit.slice(0,2)=='02'){
  //         first23digit = '02'
  //       }
  //       // console.log(first23digit)

  //       if (r.remark.indexOf(first23digit) == -1){
  //         return true;
  //       }

  //       return false
  //     })

  //     result = result.map(r=>r.id).join(',')

  //     resolve(result)

  //     // console.log(result)
  //     // clipboardy.writeSync(result);
      
  //     // resolve(result)
  //     // connection.close()
  //   })
    
  // },
  createInsertQuery: function(ids, idsAnswerQuestionsMap){
    return new Promise((resolve,reject)=>{
      
      sql1 = ids.map(record=>{
        let array4random = idsAnswerQuestionsMap[record.reference_id]
        // console.log(record,idsAnswerQuestionsMap)
        let idRandom =  array4random[Math.floor(Math.random() * array4random.length)];
        return `
          UPDATE message_logs 
          SET item_id = ${idRandom}
          WHERE id = ${record.id};
      `
      })
      

      let sql = sql1.join('')
      resolve(sql)
    })
    
  },

  executeSql: function(sql){
    return new Promise((resolve,reject)=>{

      connection.query(sql)
      .then(result=>{
        // console.log(result)
        resolve(result)
        // connection.close()
      })      
      .catch(err=>{
        console.log(err)
        // connection.close()
      })   
    })
    
  },
  
  run: async function (){
    // await asyncForEach(data_array, async data=>{
    //   await this.runEach(data)
    // })

    let ids = await this.getSqlResults() //get id with no delinquent

    let idsAnswerQuestionsMap = await this.getSqlResults_idsAnswerQuestionsMap()

    // console.log(ids)
    // console.log(mapOut)

    this.createInsertQuery(ids, idsAnswerQuestionsMap)
    // .then(this.executeSql)
    // .then(this.filterResults)
    // .then(this.getQuery)
    .then(clipboardy.writeSync)
    .then(()=>console.log('finish copied to clipboard'))
    // .catch(console.log)
    // .then(()=>connection.close())
    // .then(console.log)


    // await asyncForEach(ids, async data=>{
    //   await this.runEach(data,idsUserAtlAttrs)
    // })

    // connection.close();
    

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


