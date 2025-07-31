// console.log("yes");
// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'root',
//     password: '',
//     database: 'userForm'
// });
 
// connection.connect((err)=>{
//     if(err){
//         console.log(err.message);
//     }
//     console.log('db' + connection.state);
// })
 

 
// export async function login(userName,password){
//     try {
//         return await new Promise((resolve, reject) => {
//             connection.query('INSERT INTO usersInfo VALUES (?,?,?)',[Math.random(),userName,password],function (error, results) {
//                 if (error) reject(error);
//                 resolve(results)
//               }) 
//         })
        
//     } catch (error) {
//         console.log(error);
//     }
// }

// connection.end();


// import mysql from 'mysql2'

// // var hello = 50;
// // export{hello};

// const pool = mysql.createPool({
//     host: '127.0.0.1',
//     user: 'root',
//     password: '',
//     database: 'userForm'
// }).promise()


// export async function server(){
//     try{
//         const id = 5;
//         const name = "Hasan"
//         const pass = "555555";
//         const [result,fields] = await pool.query(`INSERT INTO usersInfo VALUES (?,?,?)`,[id,name,pass]);
//         // console.log(result[0].password);
//     }catch(error){
//         console.error(error);
//     }finally{
//         pool.end();
//         process.exit();
//     }
// };

// server();

