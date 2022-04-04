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



  cur_area:number = 0; // for area
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
  cur_Temp:any = 274
  cur_q:number = 1.602176634 * Math.pow(10,-19);


  // g_a = gallium arsenide
  // a_s = Amorphous silicon
  // c_t = Cadium telluride
  // c_i_g_s = copper indium gallium selenide 
  
      
options: any;

    constructor() {
 
        this.dataISC = {
            labels: [],
            datasets: [
                {
                    label: 'Short circuit current ',
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
                    label: 'Open Circuit Voltage',
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
        this.CURRENT_DENSITY = 15.32
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
      this.currentDensitySC.push(this.JSC)
      
      // to calculage Isc
      var I_SC = this.JSC * this.cur_area;
      const rowISC = { JSC:this.JSC,I_SC:I_SC}
      this.currentSC.push(I_SC) // to store I_sc
      this.currentTable.push(rowISC) // to store Isc table


    // to calculate Voc
   var V_OC =  this.cur_n * this.cur_k * this.cur_Temp * Math.log( (this.JSC * this.CURRENT_DENSITY) + 1 ) / this.cur_q
   this.voltageSC.push(V_OC)
   const rowVOC = { JSC:this.JSC,V_OC:V_OC}
   this.voltageTable.push(rowVOC)

    
  }

resetGraph(){
    this.materialName = 'g_a'
    this.currentDensitySC = []
    this.currentSC = []
    this.voltageSC = []
    this.currentTable = []
    this.voltageTable = []
}
  plotGraph = (event: Event)=> {
      console.log(this.currentDensitySC);
      console.log(this.voltageSC);
      
    // this.data = {
    //     labels: this.areaData,
    //     datasets: [
    //         {
    //             label: 'Short circuit current ',
    //             data: this.currentData,
    //             fill: false,
    //             borderColor: '#42A5F5',
    //             tension: .4
    //         },
    //         {
    //             label: 'Open Circuit Voltage',
    //             data: [28, 48, 40, 19, 86, 27, 90],
    //             fill: false,
    //             borderColor: '#FFA726',
    //             tension: .4
    //         }
    //     ]
    // };
      
    // this.options = {
    //     title: {
    //         display: true,
    //         text: 'My Title',
    //         fontSize: 16
    //     },
    //     legend: {
    //         position: 'bottom'
    //     }
    // };
}



// plot graph for voc
plotGraphVOC = (event:Event) =>{
    this.dataISC = {
        labels: this.currentDensitySC,
        datasets: [
            {
                label: 'Short circuit current ',
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
                label: 'Open circuit voltage ',
                data: this.voltageSC,
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




}
