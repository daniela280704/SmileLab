import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  footer: any = null;

  ngOnInit() {
    this.dataService.getFooter().subscribe((data: any) => {
      this.zone.run(() => {
        this.footer = data;
        this.cdr.detectChanges();
      });
    });
  }
}
