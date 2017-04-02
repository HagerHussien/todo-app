var db = openDatabase('todoDB', '1.0', 'todo app database', 1 * 1024 * 1024);


var user=
{    
    createTable:function()
    {
        db.transaction(function (tx) {  

        tx.executeSql('CREATE TABLE IF NOT EXISTS Users (id integer primary key, username , password)');
       });
    },
   
   insertUser:function(user)
    {
       db.transaction(function (tx) {  


         tx.executeSql('INSERT INTO Users VALUES(?,?,?) ',[user.id,user.username,user.password]);
        });
       
   },

 
   getUser:function(user)
    {
    
    return new Promise(function(resolve,reject)
    {          
     db.transaction(function(tx){
     tx.executeSql("SELECT * FROM Users WHERE username=?", [user.username] ,function(tx,res){
      if(res){

            if(!res.rows.length)
            {

              reject({status:"error",message:"data not retrive"})
            }
            else
            {
                if(res[0]== user.password)
                    var_dump(res[0]);
                    console.log(user.password);
            location.href="todo.html";
              resolve({status:"sucess", data:res.rows ,message:"good data"});

             //console.log(res.rows);

            }
        }   
        else{

           reject("an error has been ");
          }
                           });
                      })
                  
          });



    } ,

}


user.createTable();
user.insertUser({"id":1,"username":"hager","password":"hager"});


$("form").submit(function(e){

    e.preventDefault();

    var formData= $("form").serializeArray();

    var list={};

    for (var i = 0; i < formData.length; i++) {
      list[formData[i].name]=formData[i].value;
    }

   var result=user.getUser(list);
//   console.log(result);
//console.log(list.username);
//console.log(list.password);


//location.href="index2.html";




    });







