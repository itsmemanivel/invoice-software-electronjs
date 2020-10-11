import { Component,OnInit } from '@angular/core';

import { ElectronService } from './electron/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { Servicesclass } from './services.model';
import { Invoice } from './invoice.model';
import { DatePipe } from '@angular/common';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { generate } from 'rxjs';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { read } from 'fs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  selected: number;
  name:string;
  price:string;
  services: Servicesclass = new Servicesclass() ;
  selectedItems:any=[];
  total:any=0;
  paymentmd:number=0;
  invoiceNumber= (Math.random() *1000).toFixed(0);
  img;

  pipe = new DatePipe('en-US');
  now = Date.now();

  names:any=[];
  
  invoice = new Invoice(); 

  constructor(private electronService: ElectronService,
              private translate: TranslateService){
                this.translate.setDefaultLang('en');
                console.log('AppConfig:', environment);

              


              if(electronService.isElectron){
                console.log(process.env);
                console.log('Run in electron');
                console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
                console.log('Nodejs childProcess', this.electronService.childProcess);
              }else{
                console.log('Run in browser');
              }



            }

ngOnInit(){

  setTimeout(() => {
  
    this.setActive(1);
  }, 1000);


  this.getLogo();



}





setActive(value){

  if(value==1 ){ 
    var list =document.getElementById('active-list-1');
    list.style.background= "#f2f2f2";
    var list =document.getElementById('active-list-2');
    list.style.background= "none";
    var list =document.getElementById('active-list-3');
    list.style.background= "none";
  }
  if(value==2){
    var list =document.getElementById('active-list-2');
    list.style.background= "#f2f2f2";
    var list =document.getElementById('active-list-1');
    list.style.background= "none";
    var list =document.getElementById('active-list-3');
    list.style.background= "none";
  }
  if(value==3){
    var list =document.getElementById('active-list-3');
    list.style.background= "#f2f2f2";
    var list =document.getElementById('active-list-2');
    list.style.background= "none";
    var list =document.getElementById('active-list-1');
    list.style.background= "none";
  }
}


addList(value){

  var input = document.getElementById('input'+value) as HTMLInputElement;
  
  if(input.checked == true){
     input.checked = false;
     
     for(var i=0; i< this.selectedItems.length; i++){
     if(this.services.items[value].name === this.selectedItems[i].name){

      
     this.selectedItems.splice(i, 1);
     this.invoice.products.splice(i,1);
    //  console.log(this.invoice.products);
     this.totalFunc(this.selectedItems);  

   
     }
    }

  }else{
    input.checked = true;

    this.selectedItems.push(this.services.items[value]);

    this.invoice.products.push(this.services.items[value])
    // console.log(this.invoice.products);

    // console.log(this.selectedItems)

    
    this.totalFunc(this.selectedItems);
  




    
}
  
}


totalFunc(array){

  if(array.length>0){
  var total= array.map(d=> Number(d.price)).reduce((a,b) => a+b);
  this.total = total;

  // console.log(this.total);
  

  }else{
    this.total=0;
  }
}


paymentOptn(value){

  if(value==1){

    this.paymentmd=1;

    console.log(this.paymentmd)

  }else if(value==2){
    this.paymentmd=2;
    console.log(this.paymentmd)

  }
  else{
    this.paymentmd=0;
    console.log(this.paymentmd)


  }



}

generatePDF(action){


  
  
  let documentDefinition = { 

    info:{
      title: 'Invoice Blue Pixel Studio',
      author: 'VeluVijay'
    },
    content:[
      {
        columns: [
          [
            this.getLogo()
          ],
          [{
            text: 'INVOICE',
            bold: true,
            fontSize:30,
            alignment : 'right'
          },
          {
            text: this.pipe.transform(this.now, 'MM/dd/yyyy'),
            alignment : 'right'
          },
          {
            text:  'Invoice No : ' + this.invoiceNumber,
            alignment : 'right'
          },
          {
            text:  'bluepixel.studio.in@gmail.com',
            alignment : 'right'
          },
          {
            text: 'Website : ' + 'www.bluepixelstudio.in',
            link: 'https://bluepixelstudio-d99df.web.app/',
            color: 'blue',
            alignment : 'right'
          },
          ,{
            text: '                        ',
            style: 'header'
          },{
            text: 'Rs:'+ this.total,
            bold: true,
            fontSize:17,
            alignment : 'right'
          }
          ]
          
        ]
      }, {
        text: '                        ',
        style: 'header'
      },
      ,{
        text: '                        ',
        style: 'header'
      },{
        text: '                        ',
        style: 'header'
      },
      {
        columns : [
         [
          {
            text: "Sold To",
            fontSize:15,
            bold:true
          },
          {
            text: "Client :",
          
          },
          {
            text: "City :",
           
          },
          {
            text: "Country :",
            
          }
        ],
        [{
          text: "Bill To",
          fontSize:15,
          bold:true
        },
        {
          text: "Client :",
        
        },
        {
          text: "City :",
         
        },
        {
          text: "Country :",
          
        }],
        [{
          text: "Service Usage Address",
          fontSize:15,
          bold:true
        },
        {
          text: "Client :",
        
        },
        {
          text: "City :",
         
        },
        {
          text: "Country :",
          
        }]

      ]
        
      },
      {
        text: '                        ',
        style: 'header'
      },{
        text: '                        ',
        style: 'header'
      },{
        text: '                        ',
        style: 'header'
      },
     {
       columns:[
         [
           {
            table: {
              widths: ['*', '*'],
              headerRows: 1,
              margin: [0, 0, 0, 8],
              body: [
                [{
                  text: 'Services',
                  style: 'tableHeader',
                  fontSize:15,
                  bold:true,
                  fillColor: '#EAEAEA',
                },
                {
                  text: 'Amount',
                  style: 'tableHeader',
                  fontSize:15,
                  bold:true,
                  fillColor: '#EAEAEA',
                }
                
                ],
               ...this.invoice.products.map(p=> ([p.name, p.price])),
               [{text:'Total:',fontSize:15, bold:true},{text: 'Rs:'+this.total, fontSize:15, bold:true}]
              ]
             }
           }
         ]
       ]
     },
     {
      text: '                        ',
      style: 'header'
    },{
      text: '                        ',
      style: 'header'
    },{
      text: '                        ',
      style: 'header'
    },{
      text: 'Billing or Service questions? Call +91-88254-20016, +91-79046-27765.',
      style: 'header',
      fontSize:10,
      alignment:'center'
    },
    {
      text: 'Blue Pixel Studio, inc. copywrite @2020. ',
      style: 'header',
      fontSize:10,
      alignment:'center'
    },
    {
      text: 'SIMPLY INNOVATIVE',
      style: 'header',
      bold:true,
      fontSize:20,
      alignment:'center'
    }
    ]
   };


if(action==='download'){
      pdfMake.createPdf(documentDefinition).download('Invoice-blue-pixel-studio.pdf');
    }else if(action === 'print'){
      pdfMake.createPdf(documentDefinition).print();      
    }else{
      pdfMake.createPdf(documentDefinition).open();      
    }
  
  
  
  }

getLogo(){

  this.getBase64('assets/images/blue-pixel-long.png')
  .then(result => {
    this.img = result;

   
  })
  .catch(err => console.log(err));  
    
  
  if (this.img) {
    return {
      image: this.img ,
      width: 250,
      alignment : 'left'
    };
  }
  return null;



}  

async getBase64(url){

// let blob =  
// fetch('/assets/images/favicon.png').then(r => { r.blob()});

var res = await fetch(url);
var blob =  await res.blob();

return new Promise((resolve, reject) =>{

  var reader = new FileReader();
  reader.addEventListener("load", function(){
    resolve(reader.result);
  }, false);

  reader.onerror = () =>{
    return reject(this);
  };
  reader.readAsDataURL(blob);
})
    
}






}

