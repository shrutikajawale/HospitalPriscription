import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VisitService } from '../../core/services/visit-service';
import { IVisitList } from '../../core/models/interfaces/IVisit.model';

@Component({
  selector: 'app-visits',
  imports: [DatePipe, RouterLink],
  templateUrl: './visits.html',
  styleUrl: './visits.css',
})
export class Visits implements OnInit {
  private readonly visitService = inject(VisitService);

  readonly visits = signal<IVisitList[]>([]);
  readonly isLoading = signal(false);
  readonly loadError = signal(false);
  readonly showDeletePopup = signal(false);
  readonly isDeleting = signal(false);
  readonly deleteError = signal(false);
  selectedVisitId = 0;
  selectedVisitLabel = '';

  ngOnInit(): void {
    this.loadVisits();
  }

  loadVisits(): void {
    this.isLoading.set(true);
    this.loadError.set(false);

    this.visitService.getAllVisits().subscribe({
      next: (visits) => {
        this.visits.set(visits);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set(true);
      },
    });
  }

  confirmDelete(id: number, label: string): void {
    this.selectedVisitId = id;
    this.selectedVisitLabel = label;
    this.deleteError.set(false);
    this.showDeletePopup.set(true);
  }

  cancelDelete(): void {
    if (!this.isDeleting()) {
      this.showDeletePopup.set(false);
    }
  }

  deleteSelectedVisit(): void {
    if (!this.selectedVisitId || this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);
    this.deleteError.set(false);
    this.visitService.deleteVisit(this.selectedVisitId).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.showDeletePopup.set(false);
        this.loadVisits();
      },
      error: () => {
        this.isDeleting.set(false);
        this.deleteError.set(true);
      },
    });
  }
}
