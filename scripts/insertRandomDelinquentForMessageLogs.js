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
        select ml.voice_log_id from message_logs ml
left join voice_log_atlusr_maps vlam
ON ml.voice_log_id = vlam.voice_log_id
where  ml.created_at BETWEEN '2018-06-07 00:00:00 +0700' AND '2018-07-27 23:59:59 +0700' 
and vlam.voice_log_id IS NULL
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
  
  getSqlResults_idsUserAtlAttrs: async function(){
    return new Promise((resolve,reject)=>{

      let sql = `
        select id from user_atl_attrs
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
  filterResults: function(result0){
    return new Promise((resolve,reject)=>{
      let result = result0.filter(r=>{
        let first23digit = r.dnis.slice(1,4)

        if (first23digit.slice(0,2)=='02'){
          first23digit = '02'
        }
        // console.log(first23digit)

        if (r.remark.indexOf(first23digit) == -1){
          return true;
        }

        return false
      })

      result = result.map(r=>r.id).join(',')

      resolve(result)

      // console.log(result)
      // clipboardy.writeSync(result);
      
      // resolve(result)
      // connection.close()
    })
    
  },
  getQuery: function (rec){
    return `select v.id,v.ani,v.dnis,v.start_time,v.operator_id,r.id, r.customer_id,r.sub_operator_id,r.call_result,r.remark,r.created_at,r.id 
      from voice_logs v left join call_results r 
      on v.id = r.voice_log_id
      where v.id IN (${rec})
      order by v.extension`
  },
  createInsertQuery: function(ids,idsUserAtlAttrs){
    return new Promise((resolve,reject)=>{
      

      sql1 = ids.map(record=>{
        let idRandom =  idsUserAtlAttrs[Math.floor(Math.random() * idsUserAtlAttrs.length)];
        return `(${record.voice_log_id},${idRandom.id})`
      })
      .join('\n,')

      let sql = `
          insert into voice_log_atlusr_maps (voice_log_id, user_atl_id)
          values ${sql1}
      `
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

    let idsUserAtlAttrs = await this.getSqlResults_idsUserAtlAttrs()

    console.log(ids)

    this.createInsertQuery(ids, idsUserAtlAttrs)
    .then(this.executeSql)
    // .then(this.filterResults)
    // .then(this.getQuery)
    // .then(clipboardy.writeSync)
    // .catch(console.log)
    // .then(()=>connection.close())
    .then(console.log)

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


