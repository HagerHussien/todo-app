var db = openDatabase('todoDB', '1.0', 'todo app database', 1 * 1024 * 1024);
var dolist ={
    'createTable':function(){
            db.transaction(function (tx){
            tx.executeSql("CREATE TABLE IF NOT EXISTS toDo (id , title , desc , complete)");
            });
    },
    'insertRow':function(doo , id){
      console.log(doo);
      console.log(id);
            db.transaction(function (tx) {
                  tx.executeSql('INSERT INTO toDo  VALUES (?,?,?,?)',
                  [id,doo.title,doo.desc,doo.complete]);
            });
    },
     'deleteRow':function(doo){
              db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM toDo WHERE title =? ',
                    [doo]);


              });
              console.log("hager in delete");
              console.log(doo);

    },
    'updateRow':function(status,title){
            db.transaction(function (tx) {
                  tx.executeSql('UPDATE toDo SET complete =? WHERE title =? ',
                  [status,title]);
            });
    },

    'updateList':function(doo){
            db.transaction(function (tx) {
                  tx.executeSql('UPDATE toDo SET  desc=? WHERE title =? ',
                  [doo.desc,doo.title]);
            });
    },
    'getAllList':function(id){
            return new Promise(function(resolve,reject){
                db.transaction(function (tx) {
                      tx.executeSql('SELECT * FROM toDo where id=?',[id],function(tx,res){
                        if(res.rows){
                            if(!res.rows.length){
                                resolve({status:'error', messege:'there is no things'})
                            }else{
                                resolve({status:'success',data:res.rows})
                            }
                        }else{
                            reject({status:'error', messege:'error is occured'})
                        }
                      });

                });
            });
    },
    'getList':function(title){
            return new Promise(function(resolve,reject){
                db.transaction(function (tx) {
                      tx.executeSql('SELECT * FROM toDo where title=?',[title],function(tx,res){
                        if(res.rows){
                            if(!res.rows.length){
                                resolve({status:'error', messege:'there is no things'})
                            }else{
                                resolve({status:'success',data:res.rows})
                               
                                // return res.rows ;
                            }
                        }else{
                            reject({status:'error', messege:'error is occured'})
                        }
                      });

                });
            });
    },
    'rendureList':function(doo){

      for (var i = 0; i<doo.length ;i++)
      {
          if(doo[i].complete == "true"){
              $( "#complete" ).append("<div ondragstart='dragstart(event)' draggable='true' class='alert alert-success'  id='"+doo[i].title+"'>\
                <p style='color:#505050;font-size:30px;'>"+doo[i].title+"</p>\
                <p>"+doo[i].desc+"</p>\
                <button class='delete btn btn-danger "+doo[i].title+"' id='"+doo[i].title+"'>Delete</button>\
                <button class='update btn btn-success "+doo[i].title+"' id='"+doo[i].title+"' >Update</button>\
                </div>"
              );
                  
          } else if (doo[i].complete == "false") {
             $( "#notcomplete" ).append("<div ondragstart='dragstart(event)' draggable='true' class='alert alert-warning' id='"+doo[i].title+"'>\
                <p style='color:#505050;font-size:30px;'>"+doo[i].title+"</p>\
                <p>"+doo[i].desc+"</p>\
                <button class='delete btn btn-danger "+doo[i].title+"' id='"+doo[i].title+"'>Delete</button>\
                <button class='update btn btn-warning "+doo[i].title+"' id='"+doo[i].title+"' >Update</button>\
                </div>"
              );
            }   
        

      }
    }
}

var user=
{    
    createTableUser:function()
    {
        db.transaction(function (tx) {  

        tx.executeSql('CREATE TABLE IF NOT EXISTS Users (uid integer primary key, username , password)');
       });
    },
   
   insertUser:function(user)
    {
       db.transaction(function (tx) {  


         tx.executeSql('INSERT INTO Users VALUES(?,?,?) ',[user.uid,user.username,user.password]);
        });
       
   },

 
   getUser:function(user)
    {
    
    return new Promise(function(resolve,reject)
    {        

     db.transaction(function(tx){
     tx.executeSql("SELECT uid FROM Users WHERE username=? and password=?", [user.username , user.password] ,function(tx,res){
      if(res){

            if(!res.rows.length)
            {
              
             // reject({status:"error",message:"data not retrive"})
              $(document).ready(function(){
             
                $(".slidedown").slideDown();
               

               $('.close').click(function(){
                      $(".slidedown").slideUp();
                  });

             });
               


            }
            else
            {
              console.log(res.rows);
              //console.log(res);

            for (var i=0;i<res.rows.length;i++){
                var user_id=res.rows[i].uid

              //console.log(user_id);
              }

              dolist.getAllList(user_id).then(function(res){
                  console.log(res);
                  dolist.rendureList(res.data);
                } , function(res){
                 // console.log(res.messege)
                });

                $(document).ready(function(){
             
                $(".loginpage").hide("slow");

               $(".pagetodo").show("slow");


                 $('.additem').click(function(){
                      $(".form-add-item").slideDown();
                  });

                  $('.add').click(function(){
          
                    $(".form-add-item").hide("slow");
                     
                  });


                  $('body').on('click','.delete',(function(){
          
             
                $(".slidedown-delete").slideDown();
               
                 
               $('.close').click(function(){
                      $(".slidedown-delete").slideUp();

                  });
            var hager= $(this).attr('id');
            console.log(hager);
            $('.yes').attr('id',hager);
               $('.yes').click(function(){
                      
                      
               var hager = $('.yes').attr('id');

                   dolist.deleteRow(hager);

                    console.log("hager");

                   $('.'+hager).parent().remove();

                   $(".slidedown-delete").slideUp();

                  });

        
                  }));


                $('body').on('click','.update',(function(){
          
                    $(".form-update-item").slideDown();

                    
                  dolist.getList($(this).attr('id')).then(function(res){
                  console.log(res.data[0].rowid);
               
                 

                 var item=res.data[0];
                    $('form input').each(function(){
                      $(this).attr('value',item[$(this).attr('name')])

                    })
                   
                  //lists.renderlists(res.data);
                  },function(err){
                    console.log(err);

                  });


                     
                  }));
              
                $('#form-update').submit(function(e){
                  
                  e.preventDefault();
                  var formData= $("#form-update").serializeArray();
                  var list={};
                  for (var i = 0; i < formData.length; i++) {
                    list[formData[i].name] = formData[i].value
                  }
                  console.log(formData);
                   var result=dolist.updateList(list);

                    $(".form-update-item").hide("slow");
                   
                   $('.'+list.title).reload();
                
                    
                  });



                  $('.close-add').click(function(){
                      $(".form-add-item").slideUp();
                  });

                   $('.close-update').click(function(){
                      $(".form-update-item").slideUp();
                  });

                  $("#form-add").submit(function(e){
                  
                  e.preventDefault();
                  var formData= $("#form-add").serializeArray();
                  var list={};
                  for (var i = 0; i < formData.length; i++) {
                    list[formData[i].name] = formData[i].value
                  }
                   var result=dolist.insertRow(list,user_id);

                   if(list.complete == "true"){
                    $( "#complete" ).append("<div ondragstart='dragstart(event)' draggable='true'  class='alert alert-success'   id='"+list.title+"'>\
                        <p style='color:#505050;font-size:30px;'>"+list.title+"</p>\
                        <p>"+list.desc+"</p>\
                        <button class='delete btn btn-danger "+list.title+"'  id='"+list.title+"' >Delete</button>\
                        <button class='update btn btn-success "+list.title+"'  id='"+list.title+"' >Update</button>\
                        </div>"
                      );
                  }
                  else if(list.complete == "false") {
                    $( "#notcomplete" ).append("<div ondragstart='dragstart(event)' draggable='true' class='alert alert-warning' id='"+list.title+"'>\
                        <p style='color:#505050;font-size:30px;'>"+list.title+"</p>\
                        <p>"+list.desc+"</p>\
                        <button class='delete btn btn-danger "+list.title+"'  id='"+list.title+"' >Delete</button>\
                        <button class='update btn btn-warning "+list.title+"'  id='"+list.title+"' >Update</button>\
                        </div>"
                      );
                  }

                 
                });
             });

             // console.log(user_id);         
            //resolve({status:"sucess", data:res.rows ,message:"good data"});

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

user.createTableUser();
user.insertUser({"uid":1,"username":"hager","password":"hager"});
user.insertUser({"uid":2,"username":"dero","password":"dero"});
dolist.createTable();

/* var doo = {
           "id":1 ,
          "title": "test",
          "desc": "test desc" ,
          "complete" : "true"
 }
 var doo1 = {
           "id":2 ,
          "title": "test",
          "desc": "test desc" ,
          "complete" : "true"
 }
  var doo2 = {
           "id":3 ,
          "title": "test",
          "desc": "test desc" ,
          "complete" : "false"
 }
dolist.insertRow(doo);
dolist.insertRow(doo1);
dolist.insertRow(doo2);
*/


function dragstart(e) {

  console.log(e.target.id);

  e.dataTransfer.setData("eleid",e.target.id)

// dolist.rendureList(res.data);

  console.log("drag started!");
}

function dragover(e){
  e.preventDefault();
  console.log("dragged over!");
  // dolist.rendureList(res.data);
}

function drop(e){
  var id = e.dataTransfer.getData("eleid");

  e.target.appendChild(document.getElementById(id))

  e.preventDefault();

 if(e.target.id == "complete" ){
    dolist.updateRow("true",id);
 }
 else if(e.target.id == "notcomplete"){
    dolist.updateRow("false",id);
 }
   //console.log("dropped!");
    dolist.rendureList(res.data);
}




$("#form").submit(function(e){

    e.preventDefault();

    var formData= $("form").serializeArray();

    var list={};

    for (var i = 0; i < formData.length; i++) {
      list[formData[i].name]=formData[i].value;
    }

   var result=user.getUser(list);

    })



