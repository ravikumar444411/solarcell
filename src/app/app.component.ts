import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'solarCell';
 


  CURRENT_DENSITY:number = 32.7
  materialName:string = 'g_a'
  JSC:number = 0;
  minJSC:number = 18;
  maxJSC:number = 21;
  show_ff:number = 0;
  powernInput:any = 10
  show_efficency:number = 0



  cur_area:number = 100; // for area
  currentDensitySC:any = [];  //for Jsc
  
  //calculate for Isc
  dataISC: any; // graph object
  currentSC:any = [] // for Isc
  currentTable:any = [] // to show table
  
  //calculate for Voc
  dataVOC:any; // for graph object
  voltageSC:any = [] // content Voc data
  voltageTable:any = []
  cur_n:number = 1;
  cur_k:number = 1.38064852 * Math.pow(10, -23);
  cur_Temp:any = 298
  cur_q:number = 1.602176634 * Math.pow(10,-19);


  // for Isc vs Voc
  bothIscVoc:any;
  //calculate for ff
  ffData:any = []





  // g_a = gallium arsenide
  // a_s = Amorphous silicon
  // c_t = Cadium telluride
  // c_i_g_s = copper indium gallium selenide 
  
      
options: any;

    constructor() {
        
        // for Isc
        this.dataISC = {
            labels: [],
            datasets: [
                {
                    label: 'Isc vs Jsc',
                    data: [],
                    fill: false,
                    borderColor: '#42A5F5',
                    tension: .4
                }
            ]
        };
          
      

        // for voc
        this.dataVOC = {
            labels: [],
            datasets: [
                {
                    label: 'Voc vs Jsc',
                    data: [],
                    fill: false,
                    borderColor: '#FFA726',
                    tension: .4
                }
            ]
        };

        // for Isc vs Voc
         this.bothIscVoc = {
            labels: [],
            datasets: [
                {
                    label: 'Isc vs Voc',
                    data: [],
                    fill: false,
                    borderColor: '#FFA726',
                    tension: .4
                }
            ]
        };


        this.options = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
      
    }

selectMaterial(material_name:string){
    this.materialName = material_name
    if(material_name==='g_a'){
        this.CURRENT_DENSITY = 32.7
        this.minJSC = 19
        this.maxJSC = 21

    }
    else if(material_name==='a_s'){ 
        this.CURRENT_DENSITY = 9.62
        this.minJSC = 14
        this.maxJSC = 26
    }
    else if(material_name==='c_t'){
        this.CURRENT_DENSITY = 28
    }
    else if(material_name==='c_i_g_s'){
        this.CURRENT_DENSITY = 0
    }
    else{
        this.CURRENT_DENSITY = -1
    }

}

setTemp(temp_value:any){
    console.log(this.cur_Temp);
    if(this.cur_Temp < 273 && this.cur_Temp>373){
        alert('please select range between 2273 to 373')
    }
    else{
        this.cur_Temp = temp_value

    }
    
}
setArea(area_value:any){
   this.cur_area = area_value
//    console.log(this.cur_area);
   
}

addToTable(){


      //insert data in jsc table
      this.currentDensitySC.push( this.makeRoundOff(this.JSC * Math.pow(10,-3) ) )
      
      // to calculage Isc
      var I_SC = this.makeRoundOff( this.JSC * Math.pow(10,-3) * this.cur_area );
      const rowISC = { JSC:this.JSC,I_SC:I_SC}
      this.currentSC.push(I_SC) // to store I_sc
      this.currentTable.push(rowISC) // to store Isc table


    // to calculate Voc
    var totalConst = 100 * this.cur_n * this.cur_k * this.cur_Temp / this.cur_q 
    var logval = Math.log( (this.JSC / this.CURRENT_DENSITY) + 1 )
   var V_OC =  (100 * this.cur_n * this.cur_k * this.cur_Temp / this.cur_q ) * Math.log( (this.JSC / this.CURRENT_DENSITY) + 1 ) 
   this.voltageSC.push( this.makeRoundOff( V_OC) )
   const rowVOC = { JSC:this.JSC,V_OC: this.makeRoundOff( V_OC) }
   this.voltageTable.push(rowVOC)



   console.log('const', totalConst);
   console.log('logval', logval);
   console.log('voc', V_OC);

   console.log('n',this.cur_n);
   console.log('k',this.cur_k);
   console.log('T',this.cur_Temp);
   console.log('q',this.cur_q);
   console.log('j',this.JSC);
   console.log('j0',this.CURRENT_DENSITY);

    
  }

resetGraph(){
    this.materialName = 'g_a'
    this.currentDensitySC = []
    this.currentSC = []
    this.voltageSC = []
    this.currentTable = []
    this.voltageTable = []
}

// plot graph for voc
plotGraphVOC = (event:Event) =>{
    // add Isc zero to array
    this.currentDensitySC.push(0)
    this.currentSC.push(0)
    this.voltageSC.push(0)

    // console.log(this.ffData);
    // const sum = this.ffData.reduce((a:any, b:any) => a + b, 0);
    // const avg = (sum / this.ffData.length) || 0;
    // this.show_ff = (Math.round(avg * 100) / 100).toFixed(2);  // put avg ff in here

    // find max value from I (current)  array to get Isc
    const max_Isc = this.currentSC.reduce(function(prev:any, current:any) {
        return (prev > current) ? prev : current
    }) 
    // find max value from V (voltage)  array to get Voc
    const max_Voc = this.voltageSC.reduce(function(prev:any, current:any) {
        return (prev > current) ? prev : current
    }) 

    var mx_voc:number =  +max_Voc;


    
    var fillFactor = (mx_voc - Math.log(mx_voc + 0.72) )/ (mx_voc + 1)
    this.show_efficency = max_Isc * max_Voc * this.show_ff * 100 / this.powernInput

    // console.log('voc', mx_voc);
    // console.log('fill factor', fillFactor);
    // console.log('%', this.show_efficency);


    // console.log('n',this.cur_n);
    // console.log('k',this.cur_k);
    // console.log('T',this.cur_Temp);
    // console.log('q',this.cur_q);
    // console.log('j',this.JSC);
    // console.log('j0',this.CURRENT_DENSITY);
    
    

    // console.log(`The sum is: ${sum}. The average is: ${avg}.`);

    
    this.dataISC = {
        labels: this.currentDensitySC,
        datasets: [
            {
                label: 'Isc vs Voc ',
                data: this.currentSC,
                fill: false,
                borderColor: '#42A5F5',
                tension: .4
            }
        ]
    };
    this.dataVOC = {
        labels: this.currentDensitySC,
        datasets: [
            {
                label: 'Voc vs Jsc',
                data: this.voltageSC,
                fill: false,
                borderColor: '#FFA726',
                tension: .4
            }
        ]
    };
      
    // for Isc vs Voc
    this.bothIscVoc = {
        labels: this.voltageSC,
        datasets: [
            {
                label: 'Isc vs Voc',
                data: this.currentSC,
                fill: false,
                borderColor: '#FFA726',
                tension: .4
            }
        ]
    };
    this.options = {
        title: {
            display: true,
            text: 'My Title',
            fontSize: 16
        },
        legend: {
            position: 'bottom'
        }
    };
 
}



makeRoundOff(value:number){
    return (Math.round(value * 100) / 100).toFixed(2);
}
}
