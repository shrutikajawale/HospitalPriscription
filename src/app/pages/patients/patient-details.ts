import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../core/services/patient-service';
import { PatientModel } from '../../core/models/classes/Pateint.model';

@Component({
  selector: 'app-patient-details',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './patient-details.html',
  styleUrl: './patient-details.css',
})
export class PatientDetails implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly patientService = inject(PatientService);

  readonly isViewMode = signal(false);
  readonly isAddMode = signal(false);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly loadError = signal(false);
  readonly saveError = signal(false);
  readonly showSuccessPopup = signal(false);
  private patientId = 0;

  readonly patientForm = this.formBuilder.nonNullable.group({
    fullName: ['', Validators.required],
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+() -]{7,20}$/)]],
    address: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.patientId = id;
    const mode = this.route.snapshot.data['mode'];
    this.isViewMode.set(mode === 'view');
    this.isAddMode.set(mode === 'add');

    if (this.isAddMode()) {
      this.isLoading.set(false);
      return;
    }

    if (!id) {
      this.isLoading.set(false);
      this.loadError.set(true);
      return;
    }

    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patientForm.patchValue({
          fullName: patient.fullName,
          gender: patient.gender,
          dateOfBirth: this.toDateInputValue(patient.dateOfBirth),
          phone: patient.phone,
          address: patient.address,
        });
        if (this.isViewMode()) {
          this.patientForm.disable();
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set(true);
      },
    });
  }

  savePatient(): void {
    if (this.isViewMode() || this.patientForm.invalid || this.isSaving()) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(false);

    const patient = this.patientForm.getRawValue() as PatientModel;
    const saveRequest = this.isAddMode()
      ? this.patientService.createNewPatient(patient)
      : this.patientService.updatePatient(this.patientId, patient);

    saveRequest.subscribe({
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
    this.router.navigateByUrl('/admin/patients');
  }

  private toDateInputValue(value: string): string {
    return value ? value.substring(0, 10) : '';
  }
}
