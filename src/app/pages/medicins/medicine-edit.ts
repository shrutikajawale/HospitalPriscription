import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MedicineService } from '../../core/services/medicine-service';

@Component({
  selector: 'app-medicine-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './medicine-edit.html',
  styleUrl: './medicine-edit.css',
})
export class MedicineEdit implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly medicineService = inject(MedicineService);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly loadError = signal(false);
  readonly saveError = signal(false);
  readonly showSuccessPopup = signal(false);
  private medicineId = 0;

  readonly medicineForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    strength: ['', Validators.required],
    form: ['', Validators.required],
    isActive: [true],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.medicineId = id;

    if (!id) {
      this.isLoading.set(false);
      this.loadError.set(true);
      return;
    }

    this.medicineService.getMedicineById(id).subscribe({
      next: (medicine: any) => {
        this.medicineForm.patchValue({
          name: medicine.name,
          strength: medicine.strength,
          form: medicine.form,
          isActive: medicine.isActive ?? true,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set(true);
      },
    });
  }

  saveMedicine(): void {
    if (this.medicineForm.invalid || this.isSaving()) {
      this.medicineForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(false);

    this.medicineService.updateMedicine(this.medicineId, {
      medicineId: this.medicineId,
      ...this.medicineForm.getRawValue(),
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showSuccessPopup.set(true);
      },
      error: () => {
        this.isSaving.set(false);
        this.saveError.set(true);
      },
    });
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup.set(false);
    this.router.navigateByUrl('/admin/Medincines');
  }
}
