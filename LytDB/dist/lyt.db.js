/******************************
 *                            *
 *   |    \      /  ------    *
 *   |      \  /      |       *
 *   |        |       |       *
 *   ______   |       |       *
 *                            *
 *        LYTDB V1.0.0         -
 *     By Uzodimma Joseph     *
 * A portable database system *
 ******************************/


"use strict";
var lytDB=(function(){
  if(!(this instanceof lytDB)){
    throw Error("instanceof lytDB not given")
  }
 var xml;
  if(window.XMLHttpRequest){
    xml=new XMLHttpRequest()
  }else{
    xml=new ActiveXObject("Microsoft.XMLHTTP")
  }
  
this.config=function(opt){
  let opts=opt || {}
  let ds=opts.db
  let ps=opts.password
  
const data={
  dbn:ds,
  dps: ps
}
  xml.open("POST", "../lib/db.php", true)
    xml.onreadystatechange=function(){
     if(this.readyState==4 && this.status==200){
      var res=this.responseText
   if(res<4){
     return "database with similar name already exist"
   }else if(res==4){
     return "configuration successful"
   }
   console.log(res)
    }
    }
    xml.send(JSON.stringify(data))
  }
  
  //for db connection
  this.connect=function(d,p){
  
  var connres = "";
  
  let pp = parseInt(p)
    new parseGINIFile("ds/dblist.gini").then(res=>{
      const dblist = JSON.parse(res);
     const ob=Object.keys(dblist)
    
     for(var i=0;i<ob.length;i++){
    const s = ob[i]
    
      if(dblist[s].dbn==d){
        connres += "dbname found";
        const obj = dblist[s].dbp;
     
        if(parseInt(obj) == pp){
          connres += " password corresponds dbname>>[connection successful]";
    
        }else{
          connres += " password does not match dbname>>[connection aborted]";
          throw Error(connres)
        }
      }
     }
    })
  }
  
  
  this.query=function(m, q){
    let qrs=["insert", "fetch", "update", "delete", "affix"];

    return new Promise(resolve=>{
      
   let options=q || {};
  const col=options.data
  const ars=options.dbname
  //filte
   if(!qrs.includes(m)){
    resolve("type of query supplied is not supported") 
   }else{
    
    //check typeof qrs
    if(m==="insert"){
    
     
     new JSONtoGINI(col).then(js=>{
     const dat={
    uri:ars,
      opt: js[0],
     }
       
    xml.open("POST", "../lib/dbpr.php")
       xml.onreadystatechange=function(){
         if(this.readyState==4 && this.status==200){
           const resp=this.responseText
       resolve(resp)
         }
       }
     xml.send(JSON.stringify(dat))
     })
    }
    
    if(m==="fetch"){
      
      new parseGINIFile(`../ds/ts/${ars}.gini`).then(result=>{
        resolve(JSON.parse(result))
      })
      
    }
    
  if(m==="update"){
   
   const valkey=options.keys;
   const updater = options.update;
    if( typeof valkey != "object") throw Error("update error in key>>[expected array type but found"+" "+typeof valkey+"]");
   else{
    new parseGINIFile(`../ds/ts/${ars}.gini`).then(result=>{
        
        const fetc=JSON.parse(result);
        
        const parse=Object.keys(fetc);
      valkey.forEach(v=>{
        
        if(v in fetc){
          
          const hold = fetc[v];
   if(!(updater[0] in hold)){
     resolve(`"${updater[0]}"`+" " +"is not a column in row"+" "+ `"${v}"`);
   }else{
      //update target
      hold[updater[0]] = updater[1]
     //store updated data
      
     new JSONtoGINI(fetc).then(f=>{
     const daf={
    uri:ars,
      opt: f[0],
     }
       
    xml.open("POST", "../lib/update.php")
       xml.onreadystatechange=function(){
         if(this.readyState==4 && this.status==200){
           const respo=this.responseText
     if(respo == "data inserted to db"+" "+ars){
       resolve("update successful for stringified data"+" "+JSON.stringify(fetc))
     }
         }
       }
     xml.send(JSON.stringify(daf))
     })
   }
        
         }else{
           resolve("invalid key"+" "+`"${v}"`)
         }
      })
        
        
         })
   }    
    
  }
  
     
   }
    
    //for delete
    if(m==="delete"){
       const valkey=options.keys;
   const updater = options.clear;
    if( typeof valkey != "object") throw Error("update error in key>>[expected array type but found"+" "+typeof valkey+"]");
   else{
    new parseGINIFile(`../ds/ts/${ars}.gini`).then(result=>{
        
        const fetc=JSON.parse(result);
        
        const parse=Object.keys(fetc);
      valkey.forEach(v=>{
        
        if(v in fetc){
          
          const hold = fetc[v];
   if(!(updater[0] in hold)){
     resolve(`"${updater[0]}"`+" " +"is not a column in row"+" "+ `"${v}"`);
   }else{
      //remove target
      delete hold[updater[0]]
     //store updated data
      
     new JSONtoGINI(fetc).then(f=>{
     const daf={
    uri:ars,
      opt: f[0],
     }
       
    xml.open("POST", "../lib/update.php")
       xml.onreadystatechange=function(){
         if(this.readyState==4 && this.status==200){
           const respo=this.responseText
     if(respo == "data inserted to db"+" "+ars){
       resolve("delete successful for stringified data"+" "+JSON.stringify(fetc))
     }
         }
       }
     xml.send(JSON.stringify(daf))
     })
   }
        
         }else{
           resolve("invalid key"+" "+`"${v}"`)
         }
      })
        
        
         })
   }    
    
  
  
  //end delete 
    }
  
  //for affix
  if(m==="affix"){
   
 const valkey=options.keys;
   const updater = options.affix;
    if( typeof valkey != "object") throw Error("update error in key>>[expected array type but found"+" "+typeof valkey+"]");
   else{
    new parseGINIFile(`../ds/ts/${ars}.gini`).then(result=>{
        
        const fetc=JSON.parse(result);
        
        const parse=Object.keys(fetc);
      valkey.forEach(v=>{
        
        if(v in fetc){
          
          const hold = fetc[v];
   if(updater[0] in hold){
     resolve(`"${updater[0]}"`+" " +"is already a column in row"+" "+ `"${v}", try deleting and affixing again`);
   }else{
      //affix target
      hold[updater[0]] = updater[1]
     //store updated data
      
     new JSONtoGINI(fetc).then(f=>{
     const daf={
    uri:ars,
      opt: f[0],
     }
       
    xml.open("POST", "../lib/update.php")
       xml.onreadystatechange=function(){
         if(this.readyState==4 && this.status==200){
           const respo=this.responseText
     if(respo == "data inserted to db"+" "+ars){
       resolve("affix successful for stringified data"+" "+JSON.stringify(fetc))
     }
         }
       }
     xml.send(JSON.stringify(daf))
     })
   }
        
         }else{
           resolve("invalid key"+" "+`"${v}"`)
         }
      })
        
        
         })
   }    
   
   //end affix 
  }
  
  
    })
  }
  
})