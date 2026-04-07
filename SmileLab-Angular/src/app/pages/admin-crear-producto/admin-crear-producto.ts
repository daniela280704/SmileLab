import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Database, ref as dbRef, push } from '@angular/fire/database';

@Component({
  selector: 'app-admin-crear-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-crear-producto.html',
  styleUrl: './admin-crear-producto.css',
})
export class AdminCrearProducto {
  productoForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10)]),
    precio: new FormControl('', [Validators.required, Validators.min(0.01)]),
  });

  selectedFile: File | null = null;
  base64Image: string | null = null;
  isUploading = false;

  constructor(private database: Database) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Convertir la imagen a Base64 para saltarnos la tarjeta de crédito del Storage
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.base64Image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async enviarProducto() {
    if (this.productoForm.invalid || !this.selectedFile || !this.base64Image) {
      alert('Por favor, rellena todos los campos y selecciona una imagen.');
      return;
    }

    this.isUploading = true;

    try {
      // Guardar directamente en Realtime Database usando la imagen en Base64
      const productData = {
        ...this.productoForm.value,
        imagen: this.base64Image,
        fechaCreacion: new Date().toISOString()
      };

      const listRef = dbRef(this.database, 'productos');
      await push(listRef, productData);

      alert('¡Producto creado con éxito y guardado en Firebase!');
      this.productoForm.reset();
      this.selectedFile = null;
      this.base64Image = null;
      
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Hubo un error al procesar la subida. Revisa la consola.');
    } finally {
      this.isUploading = false;
    }
  }
}
