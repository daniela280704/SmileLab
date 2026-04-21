import { Component, inject } from '@angular/core';
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

  productoForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10)]),
    precio: new FormControl('', [Validators.required, Validators.min(0.01)]),
  });

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading = false;
  uploadProgress = 0;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona una imagen válida.');
      event.target.value = '';
    }
  }

  enviarProducto() {
    if (this.productoForm.invalid || !this.selectedFile) {
      alert('Formulario incompleto.');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 20;

    const rawValues = this.productoForm.value;
    
    // Mapeamos el objeto para que coincida exactamente con lo que espera el catálogo de SmileLab
    const productoParaFirebase = {
      nombre: rawValues.nombre,
      descripcion: rawValues.descripcion,
      precio: `${rawValues.precio}€`, // Añadimos el símbolo de euro como en el JSON original
      alt: `Imagen de ${rawValues.nombre}`, // Generamos el texto ALT automáticamente
      href: `#${rawValues.nombre?.toLowerCase().replace(/ /g, '_')}`, // Generamos un ID amigable
      placeholderClass: 'product-placeholder-new'
    };

    this.dataService.addProductoConImagen(productoParaFirebase, this.selectedFile)
      .subscribe({
        next: () => {
          this.uploadProgress = 100;
          setTimeout(() => {
            alert('¡Conectado! Producto publicado con éxito en la nube.');
            this.resetForm();
          }, 500);
        },
        error: (err) => {
          console.error(err);
          alert('Error de conexión con Firebase Storage. Verifica las reglas de seguridad.');
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
