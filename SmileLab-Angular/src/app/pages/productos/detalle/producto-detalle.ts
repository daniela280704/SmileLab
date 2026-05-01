// Controlador del componente Producto detalle
import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../../core/services/data';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css'
})
export class ProductoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  producto: any = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.dataService.getProductoById(id).subscribe((data: any) => {
          this.zone.run(() => {
            this.producto = data;
            this.cdr.detectChanges();
          });
        });
      }
    });
  }
}
