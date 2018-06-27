
var mysql      = require('mysql')

const config = {
  host     : '192.168.1.50',
  user     : 'mysqladmin',
  password : 'Password@1',
  database : 'aohsdb_dev2',
  multipleStatements: true
}

// var connectionOld = mysql.createConnection(config)

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
 
 // connection.connect();
const connection = new Database(config)

const data={
  tags2: [
      "IVR",
      "private",
      "Silence",
      "เกี่ยวกับการเซ็นเอกสาร",
      "ขอเลื่อนจ่าย",
      "ขับรถอยู่",
      "คนในครอบครัวป่วย",
      "จะจ่าย",
      "จะช่วยติดต่อให้",
      "จะชำระให้",
      "จะปิดบัญชี",
      "จ่าย",
      "จ่ายแล้ว",
      "แจ้งชำระเพิ่ม",
      "แจ้งนัดชำระ",
      "แจ้งโปรโมชั่น",
      "ชำระจ่ายบางส่วน",
      "ชำระเรียบร้อยแล้ว แต่ยอดยังไม่ขึ้น",
      "ชำระวันนี้",
      "ได้รับใบแจ้งยอดแล้ว",
      "ตกงานอยู่",
      "ตามเอกสาร ประนอมหนี้",
      "ติดงานอยู่ เข้ากะ",
      "ติดต่อลูกค้าไม่ได้",
      "ทำงานในรายการผลิต รับสายไม่ได้",
      "ทำตามระบบก็แล้วกัน",
      "นัดชำระวันนี้",
      "นัดเซ็นเอกสาร",
      "นัดวัน",
      "บุคคลอื่นรับสาย",
      "บุคคลอื่นรับสาย _ คนค้ำ",
      "ประนอมหนี้ ตามยอด",
      "ไปทำงานต่างประเทศ",
      "ฝากคนอื่นไปจ่าย",
      "ฝากติดต่อกลับ",
      "ฟ้องไปเลย",
      "ภาษาใต้",
      "ยังไม่ได้ชำระ กำลังจะไปชำระ",
      "ยังไม่ได้ใบแจ้งยอด",
      "ยังไม่มี ยังหาไม่ได้เลย",
      "ยังไม่สรุปการจ่าย",
      "ย้ายแผนกแล้ว",
      "ย้ายออกจากบริษัทแล้ว",
      "ยื่นกู้อยู่",
      "รอจ่าย",
      "รอติดต่อสอบถามข้อมูลเพิ่มเติม",
      "รอประสานงาน",
      "ลางาน",
      "ลาออกจากบริษัท",
      "ลืมเอาโทรศัพท์ไว้",
      "ลูกค้าป่วย",
      "สอบถาม สถานะพนักงาน",
      "สอบถามข้อมูล",
      "สอบถามเบอร์ลูกค้า จาก บุคคลอื่น",
      "สอบถามรายละเอียด",
      "สอบถามเรื่องเอกสาร",
      "สัญญาณแฟกซ์",
      "เสนอประนอมหนี้",
      "เอกสาร"
  ],
  tags1: ["ไม่เข้าเงื่อนไข", "ลูกค้าติดงานหรือขับรถอยู่ไม่สะดวกคุย", "ลูกค้ารับปากว่าจะชำระ", "ลูกค้าแจ้งชำระแล้ว", "พนักงานสอบถามเอกสารบิลใบแจ้ง", "ลูกค้าพิจารณาประนอมหนี้", "บุคคลที่สามรับสาย", "ลูกค้าอยู่ต่างประเทศ", "ลูกค้าฝากบุคคลอื่นไปจ่าย", "ลูกค้าให้ฟ้องไปเลย", "ลูกค้ายังหาเงินไม่ได้", "ลูกค้ากำลังยื่นกู้", "ลูกค้าป่วย"],
  mappingFromCern:  [
      {
        "word": "IVR",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "private",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "Silence",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "เกี่ยวกับการเซ็นเอกสาร",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ขอเลื่อนจ่าย",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ขับรถอยู่",
        "words": [
          "ลูกค้าติดงานหรือขับรถอยู่ไม่สะดวกคุย"
        ]
      },
      {
        "word": "คนในครอบครัวป่วย",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "จะจ่าย",
        "words": [
          "ลูกค้ารับปากว่าจะชำระ"
        ]
      },
      {
        "word": "จะช่วยติดต่อให้",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "จะชำระให้",
        "words": [
          "ลูกค้ารับปากว่าจะชำระ"
        ]
      },
      {
        "word": "จะปิดบัญชี",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "จ่าย",
        "words": [
          "ลูกค้ารับปากว่าจะชำระ"
        ]
      },
      {
        "word": "จ่ายแล้ว",
        "words": [
          "ลูกค้าแจ้งชำระแล้ว"
        ]
      },
      {
        "word": "แจ้งชำระเพิ่ม",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "แจ้งนัดชำระ",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "แจ้งโปรโมชั่น",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ชำระจ่ายบางส่วน",
        "words": [
          "ลูกค้ารับปากว่าจะชำระ"
        ]
      },
      {
        "word": "ชำระเรียบร้อยแล้ว แต่ยอดยังไม่ขึ้น",
        "words": [
          "ลูกค้าแจ้งชำระแล้ว"
        ]
      },
      {
        "word": "ชำระวันนี้",
        "words": [
          "ลูกค้ารับปากว่าจะชำระ"
        ]
      },
      {
        "word": "ได้รับใบแจ้งยอดแล้ว",
        "words": [
          "พนักงานสอบถามเอกสารบิลใบแจ้ง"
        ]
      },
      {
        "word": "ตกงานอยู่",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ตามเอกสาร ประนอมหนี้",
        "words": [
          "ลูกค้าพิจารณาประนอมหนี้"
        ]
      },
      {
        "word": "ติดงานอยู่ เข้ากะ",
        "words": [
          "ลูกค้าติดงานหรือขับรถอยู่ไม่สะดวกคุย"
        ]
      },
      {
        "word": "ติดต่อลูกค้าไม่ได้",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ทำงานในรายการผลิต รับสายไม่ได้",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ทำตามระบบก็แล้วกัน",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "นัดชำระวันนี้",
        "words": [
          "ลูกค้ารับปากว่าจะชำระ"
        ]
      },
      {
        "word": "นัดเซ็นเอกสาร",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "นัดวัน",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "บุคคลอื่นรับสาย",
        "words": [
          "บุคคลที่สามรับสาย"
        ]
      },
      {
        "word": "บุคคลอื่นรับสาย _ คนค้ำ",
        "words": [
          "บุคคลที่สามรับสาย"
        ]
      },
      {
        "word": "ประนอมหนี้ ตามยอด",
        "words": [
          "ลูกค้าพิจารณาประนอมหนี้"
        ]
      },
      {
        "word": "ไปทำงานต่างประเทศ",
        "words": [
          "ลูกค้าอยู่ต่างประเทศ"
        ]
      },
      {
        "word": "ฝากคนอื่นไปจ่าย",
        "words": [
          "ลูกค้าฝากบุคคลอื่นไปจ่าย"
        ]
      },
      {
        "word": "ฝากติดต่อกลับ",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ฟ้องไปเลย",
        "words": [
          "ลูกค้าให้ฟ้องไปเลย"
        ]
      },
      {
        "word": "ภาษาใต้",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ยังไม่ได้ชำระ กำลังจะไปชำระ",
        "words": [
          "ลูกค้าฝากบุคคลอื่นไปจ่าย"
        ]
      },
      {
        "word": "ยังไม่ได้ใบแจ้งยอด",
        "words": [
          "พนักงานสอบถามเอกสารบิลใบแจ้ง"
        ]
      },
      {
        "word": "ยังไม่มี ยังหาไม่ได้เลย",
        "words": [
          "ลูกค้ายังหาเงินไม่ได้"
        ]
      },
      {
        "word": "ยังไม่สรุปการจ่าย",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ย้ายแผนกแล้ว",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ย้ายออกจากบริษัทแล้ว",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ยื่นกู้อยู่",
        "words": [
          "ลูกค้ากำลังยื่นกู้"
        ]
      },
      {
        "word": "รอจ่าย",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "รอติดต่อสอบถามข้อมูลเพิ่มเติม",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "รอประสานงาน",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "ลางาน",
        "words": [
          "บุคคลที่สามรับสาย"
        ]
      },
      {
        "word": "ลาออกจากบริษัท",
        "words": [
          "บุคคลที่สามรับสาย"
        ]
      },
      {
        "word": "ลืมเอาโทรศัพท์ไว้",
        "words": [
          "บุคคลที่สามรับสาย"
        ]
      },
      {
        "word": "ลูกค้าป่วย",
        "words": [
          "ลูกค้าป่วย"
        ]
      },
      {
        "word": "สอบถาม สถานะพนักงาน",
        "words": [
          "บุคคลที่สามรับสาย"
        ]
      },
      {
        "word": "สอบถามข้อมูล",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "สอบถามเบอร์ลูกค้า จาก บุคคลอื่น",
        "words": [
          "บุคคลที่สามรับสาย"
        ]
      },
      {
        "word": "สอบถามรายละเอียด",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "สอบถามเรื่องเอกสาร",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "สัญญาณแฟกซ์",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      },
      {
        "word": "เสนอประนอมหนี้",
        "words": [
          "ลูกค้าพิจารณาประนอมหนี้"
        ]
      },
      {
        "word": "เอกสาร",
        "words": [
          "ไม่เข้าเงื่อนไข"
        ]
      }
    ]
}

const task={
  sample: function(){
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) throw error;
      console.log('The solution is: ', results[0].solution);
    })
  },
  getNoTagsOld: function(){
    let tags =  data.tag2

    let no_tags=[]
    let counter=0
    tags.forEach(tag=>{
      connection.query(`SELECT * FROM tags WHERE name='${tag}'`, function (error, results, fields) {
        if (error) throw error;
        counter++;
        if (results.length===0){
          no_tags.push(tag)
        }else{
          console.log(`Exists: ${tag}`)
        }
        if (counter >= tags.length ){
          console.log(no_tags);
          task.insertTags(no_tags)
        }
        
      });
    })
  },
  joinTags4SQL: function (tags){
    str = tags.map(tag=>`'${tag}'`)
    .join(',')

    str = `(${str})`

    return str
  },
  insertTags: function(){
    let tags =  data.tags2

    tags4sql= task.joinTags4SQL(tags)
    connection.query(`SELECT name FROM tags WHERE name IN ${tags4sql}`)
    .then(namesExist=>{
      namesOnly = namesExist.map(n=>n.name)
      console.log(namesOnly)
      return tags.filter(tag=>{
        return namesOnly.indexOf(tag) === -1
      })
    })
    .then(namesNotExist=>{
      console.log(namesNotExist)
      return namesNotExist.map(tag=>{
        return `INSERT INTO tags (name,created_at,updated_at,parent_id) VALUES ('${tag}',NOW(),NOW(),0);`
      })
      .join("\n")      
    })
    .then(sql=>{
      console.log(sql)
      connection.query(sql)
      .then(result=>
        console.log(result)
      )      
    })
    .catch(err=>
      console.log(err)
    )      
  },
  insertTagsOld: function(tags){
    let counter = 0
    tags.forEach(tag=>{
      // console.log(tag)
      var query = connection.query(`INSERT INTO tags (name,created_at,updated_at,parent_id) VALUES ('${tag}',NOW(),NOW(),0)`, function (error, results, fields) {
        if (error) {
          return connection.rollback(function() {
            throw error;
          });
        }
        connection.commit(function(err) {
          if (err) {
            return connection.rollback(function() {
              throw err;
            });
          }
          counter++;
          console.log(`Insert ${tag}`);
          if (counter >= tags.length ){
            console.log('Finish insert into table');
            
          }
          console.log('success!');
        });
        
      })
      console.log(query.sql)
    })    
  },
  insertTagsMappingOld: function(){
    let mappings = task.mappingFromCern()
    let counter=0
    mappings.forEach(mapping=>{
      var query = connection.query(`INSERT INTO tag_mappings (tag_name,tag_id,created_at,updated_at) VALUES ('${mapping.word}',(SELECT id FROM tags WHERE name='${mapping.words[0]}'),NOW(),NOW())`, function (error, results, fields) {
        if (error) {
          return connection.rollback(function() {
            throw error;
          });
        }
        connection.commit(function(err) {
          if (err) {
            return connection.rollback(function() {
              throw err;
            });
          }
          counter++;
          // console.log(`Insert ${tag}`);
          if (counter >= tags.length ){
            console.log('Finish insert into table');
            
          }
          console.log('success!');
        });
        
      })
      console.log(query.sql)
    })    
  },
  insertTagsMapping: function(){
    let mappings = data.mappingFromCern
    
    let sql = mappings.map(mapping=>{
      return `INSERT INTO tag_mappings (tag_name,tag_id,created_at,updated_at) VALUES ('${mapping.word}',(SELECT id FROM tags WHERE name='${mapping.words[0]}'),NOW(),NOW());`
    })
    .join("\n")
    console.log(sql)

    connection.query(sql)
    .then(result=>
      console.log(result)
    )      
    .catch(err=>
      console.log(err)
    )      
  },
}
 
// task.insertTags();
task.insertTagsMapping();
 
// connection.end();

// connection.close();


