import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../core/services/patient-service';
import { IPatientListModel } from '../../core/models/interfaces/IPatinet.model';

@Component({
  selector: 'app-patients',
  imports: [DatePipe, RouterLink],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit {
  private readonly patientService = inject(PatientService);

  readonly patients = signal<IPatientListModel[]>([]);
  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly isLoading = signal(false);
  readonly loadError = signal(false);
  readonly showDeletePopup = signal(false);
  readonly isDeleting = signal(false);
  readonly deleteError = signal(false);
  selectedPatientId = 0;
  selectedPatientName = '';

  readonly filteredPatients = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.patients();
    }

    return this.patients().filter((patient) =>
      [patient.fullName, patient.gender, patient.phone, patient.address]
        .some((value) => String(value ?? '').toLowerCase().includes(term)),
    );
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredPatients().length / this.pageSize())),
  );

  readonly pagedPatients = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredPatients().slice(start, start + this.pageSize());
  });

  readonly rangeStart = computed(() =>
    this.filteredPatients().length ? (this.currentPage() - 1) * this.pageSize() + 1 : 0,
  );

  readonly rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.filteredPatients().length),
  );

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading.set(true);
    this.loadError.set(false);

    this.patientService.getAllPatient().subscribe({
      next: (patients) => {
        this.patients.set(patients);
        this.currentPage.set(1);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set(true);
      },
    });
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.updateSearch('');
  }

  previousPage(): void {
    this.currentPage.update((page) => Math.max(1, page - 1));
  }

  nextPage(): void {
    this.currentPage.update((page) => Math.min(this.totalPages(), page + 1));
  }

  exportPdf(): void {
    window.print();
  }

  confirmDelete(id: number, name: string): void {
    this.selectedPatientId = id;
    this.selectedPatientName = name;
    this.deleteError.set(false);
    this.showDeletePopup.set(true);
  }

  cancelDelete(): void {
    if (!this.isDeleting()) {
      this.showDeletePopup.set(false);
    }
  }

  deleteSelectedPatient(): void {
    if (!this.selectedPatientId || this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);
    this.deleteError.set(false);

    this.patientService.deletePatient(this.selectedPatientId).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.showDeletePopup.set(false);
        this.loadPatients();
      },
      error: () => {
        this.isDeleting.set(false);
        this.deleteError.set(true);
      },
    });
  }
}
