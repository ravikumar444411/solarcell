import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';


@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit {

  myForm!: FormGroup; 

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
         this.myForm = this.fb.group({
          material: '1'
        });
  }

}
