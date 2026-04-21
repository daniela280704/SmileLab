import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Database, ref as dbRef, push } from '@angular/fire/database';
import { Storage, ref as storageRef, uploadBytes, getDownloadURL } from '@angular/fire/storage';

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
  base64Image: string | null = null; // Usado solo para previsualización en el HTML
  isUploading = false;

  constructor(private database: Database, private storage: Storage) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Mantener Base64 solo para previsualización visual antes de enviar
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.base64Image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async enviarProducto() {
    if (this.productoForm.invalid || !this.selectedFile) {
      alert('Por favor, rellena todos los campos y selecciona una imagen.');
      return;
    }

    this.isUploading = true;

    try {
      // 1. Subir el archivo físico a Firebase Storage
      const filePath = `productos/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = storageRef(this.storage, filePath);

      // Subida efectiva del archivo
      const uploadResult = await uploadBytes(fileRef, this.selectedFile);

      // 2. Obtener la URL de descarga (el simple texto que pide el Sprint)
      const downloadURL = await getDownloadURL(fileRef);

      // 3. Guardar en Realtime Database usando la URL de Storage
      const productData = {
        ...this.productoForm.value,
        imagen: downloadURL, // Ahora es una URL real, no un Base64 gigante
        fechaCreacion: new Date().toISOString()
      };

      const listRef = dbRef(this.database, 'productos');
      await push(listRef, productData);

      alert('¡Producto creado con éxito! Imagen subida a Storage y datos guardados en la DB.');

      // Limpiar formulario
      this.productoForm.reset();
      this.selectedFile = null;
      this.base64Image = null;

    } catch (error) {
      console.error('Error al procesar el producto:', error);
      alert('Hubo un error al subir la imagen o los datos. Revisa la consola.');
    } finally {
      this.isUploading = false;
    }
  }
}
