// Controlador del componente Admin crear producto
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data';

@Component({
  selector: 'app-admin-crear-producto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-crear-producto.html',
  styleUrl: './admin-crear-producto.css',
})
export class AdminCrearProducto {
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  productoForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10)]),
    precio: new FormControl('', [Validators.required, Validators.min(0.01)]),
  });

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading = false;
  uploadProgress = 0;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  showModal = false;

  onFileSelected(event: any) {
    this.errorMsg = null;
    const file = event.target.files[0];
    // Capturamos el archivo de imagen seleccionado por el usuario para pasárselo al servicio de Firebase
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.cdr.detectChanges(); // Forzamos la detección de cambios para mostrar la imagen al instante
      };
      reader.readAsDataURL(file);
    } else {
      this.errorMsg = 'Por favor, selecciona una imagen válida.';
      event.target.value = '';
    }
  }

  enviarProducto() {
    this.errorMsg = null;
    this.successMsg = null;

    if (this.productoForm.invalid || !this.selectedFile) {
      this.errorMsg = 'Formulario incompleto. Asegúrate de rellenar todos los campos y seleccionar una imagen.';
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 20;

    const rawValues = this.productoForm.value;

    const productoParaFirebase = {
      nombre: rawValues.nombre,
      descripcion: rawValues.descripcion,
      precio: `${rawValues.precio}€`,
      alt: `Imagen de ${rawValues.nombre}`,
      href: `#${rawValues.nombre?.toLowerCase().replace(/ /g, '_')}`,
      placeholderClass: 'product-placeholder-new'
    };

    this.dataService.addProductoConImagen(productoParaFirebase, this.selectedFile)
      .subscribe({
        next: () => {
          this.uploadProgress = 100;
          this.showModal = true;
          this.resetForm();
        },
        error: (err: any) => {
          console.error(err);
          this.errorMsg = 'Error al publicar el producto. Verifica la conexión con la base de datos.';
          this.isUploading = false;
        },
        complete: () => this.isUploading = false
      });
  }

  private resetForm() {
    this.productoForm.reset();
    this.selectedFile = null;
    this.previewUrl = null;
    this.isUploading = false;
    this.uploadProgress = 0;
  }
}
