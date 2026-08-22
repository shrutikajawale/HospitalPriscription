import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MedicineService } from '../../core/services/medicine-service';

@Component({
  selector: 'app-medicins',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './medicins.html',
  styleUrl: './medicins.css',
})
export class Medicins implements OnInit {

medicineList = signal<any[]>([]);
showDeletePopup = signal(false);
isDeleting = signal(false);
deleteError = signal(false);
selectedMedicineId = 0;
selectedMedicineName = '';
showAddForm = signal(false);
isAdding = signal(false);
addError = signal(false);
showAddSuccess = signal(false);

private readonly formBuilder = inject(FormBuilder);
readonly medicineForm = this.formBuilder.nonNullable.group({
  name: ['', Validators.required],
  strength: ['', Validators.required],
  form: ['', Validators.required],
  isActive: [true],
});

constructor(private medicinservice: MedicineService){}

 ngOnInit(){
  
  this.loadMedicines();
 }

 loadMedicines() {
  this.medicinservice.getAllMedicine().subscribe({
    next:(res)=>{
      this.medicineList.set(res as any[]);
      console.log(res);
    },
    error:(err)=>{
       console.log("error occured");
    }    
  });
 }

 openAddForm(): void {
  this.medicineForm.reset({ name: '', strength: '', form: '', isActive: true });
  this.addError.set(false);
  this.showAddSuccess.set(false);
  this.showAddForm.set(true);
 }

 closeAddForm(): void {
  if (!this.isAdding()) {
    this.showAddForm.set(false);
  }
 }

 addMedicine(): void {
  if (this.medicineForm.invalid || this.isAdding()) {
    this.medicineForm.markAllAsTouched();
    return;
  }

  this.isAdding.set(true);
  this.addError.set(false);

  this.medicinservice.createMedicine(this.medicineForm.getRawValue()).subscribe({
    next: () => {
      this.isAdding.set(false);
      this.showAddForm.set(false);
      this.showAddSuccess.set(true);
      this.loadMedicines();
    },
    error: () => {
      this.isAdding.set(false);
      this.addError.set(true);
    },
  });
 }

 closeAddSuccess(): void {
  this.showAddSuccess.set(false);
 }

 confirmDelete(id: number, name: string): void {
  this.selectedMedicineId = id;
  this.selectedMedicineName = name;
  this.deleteError.set(false);
  this.showDeletePopup.set(true);
 }

 cancelDelete(): void {
  if (!this.isDeleting()) {
    this.showDeletePopup.set(false);
  }
 }

 deleteSelectedMedicine(): void {
  if (!this.selectedMedicineId || this.isDeleting()) {
    return;
  }

  this.isDeleting.set(true);
  this.deleteError.set(false);

  this.medicinservice.deleteMedicine(this.selectedMedicineId).subscribe({
    next: () => {
      this.isDeleting.set(false);
      this.showDeletePopup.set(false);
      this.loadMedicines();
    },
    error: () => {
      this.isDeleting.set(false);
      this.deleteError.set(true);
    },
  });
 }


  
}
