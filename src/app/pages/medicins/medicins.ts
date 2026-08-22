import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MedicineService } from '../../core/services/medicine-service';

@Component({
  selector: 'app-medicins',
  imports: [RouterLink],
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
