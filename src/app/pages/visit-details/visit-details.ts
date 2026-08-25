import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VisitService } from '../../core/services/visit-service';
import { IVisitModel } from '../../core/models/interfaces/IVisit.model';

@Component({
  selector: 'app-visit-details',
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './visit-details.html',
  styleUrl: './visit-details.css',
})
export class VisitDetails implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly visitService = inject(VisitService);

  readonly isViewMode = signal(false);
  readonly isAddMode = signal(false);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly loadError = signal(false);
  readonly saveError = signal(false);
  readonly showSuccessPopup = signal(false);
  readonly visit = signal<IVisitModel | null>(null);
  private visitId = 0;

  readonly visitForm = this.formBuilder.nonNullable.group({
    patientId: [0, [Validators.required, Validators.min(1)]],
    doctorId: [0, [Validators.required, Validators.min(1)]],
    visitDate: ['', Validators.required],
    symptoms: ['', Validators.required],
    diagnosis: ['', Validators.required],
  });

  ngOnInit(): void {
    this.visitId = Number(this.route.snapshot.paramMap.get('id'));
    const mode = this.route.snapshot.data['mode'];
    this.isViewMode.set(mode === 'view');
    this.isAddMode.set(mode === 'add');

    if (this.isAddMode()) {
      this.isLoading.set(false);
      return;
    }

    if (!this.visitId) {
      this.isLoading.set(false);
      this.loadError.set(true);
      return;
    }

    this.visitService.getVisitById(this.visitId).subscribe({
      next: (visit) => {
        this.visit.set(visit);
        this.visitForm.patchValue({
          patientId: visit.patientId,
          doctorId: visit.doctorId,
          visitDate: this.toDateTimeInputValue(visit.visitDate),
          symptoms: visit.symptoms,
          diagnosis: visit.diagnosis,
        });
        if (this.isViewMode()) {
          this.visitForm.disable();
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set(true);
      },
    });
  }

  saveVisit(): void {
    if (this.isViewMode() || this.visitForm.invalid || this.isSaving()) {
      this.visitForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(false);
    const visit = this.visitForm.getRawValue() as IVisitModel;

    const saveRequest = this.isAddMode()
      ? this.visitService.createVisit(visit)
      : this.visitService.updateVisit(this.visitId, { ...visit, visitId: this.visitId });

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
    this.router.navigateByUrl('/admin/visits');
  }

  private toDateTimeInputValue(value: string): string {
    return value ? value.substring(0, 16) : '';
  }
}
