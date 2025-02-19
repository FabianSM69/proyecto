import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'invsupp12@gmail.com',  // Correo de destino
        subject: 'Nuevo mensaje de soporte',
        text: `De: ${name} <${email}>\n\nMensaje:\n\n${message}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error al enviar el correo:', err);
            return res.status(500).json({ error: 'Error al enviar el correo' });
        }
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    });
});

// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a MySQL!');
});

// Ruta para registrar un usuario (ya existente)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error registrando usuario' });
        }
        res.json({ message: 'Usuario registrado exitosamente!' });
    });
});

// Ruta para iniciar sesión (ya existente)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

        res.json({ message: 'Inicio de sesión exitoso!' });
    });
});

// Ruta para obtener todos los productos
app.get('/getproductos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los productos' });
        }
        res.json(results); // Devolvemos los productos como respuesta
    });
});

// Ruta para modificar un producto
app.put('/modifyproduct', (req, res) => {
    const { id, cantidad, precio } = req.body;

    // Verificar si los campos requeridos existen
    if (!id || cantidad === undefined || precio === undefined) {
        return res.status(400).json({ error: 'Faltan parámetros necesarios' });
    }

    // Actualizar el producto en la base de datos
    db.query(
        'UPDATE productos SET cantidad = ?, precio = ? WHERE id = ?',
        [cantidad, precio, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al modificar el producto' });
            }

            // Registrar la actividad de modificación
            const actividad = `Producto con ID ${id} modificado con nueva cantidad ${cantidad} y precio ${precio}`;
            const fecha = new Date();
            db.query('INSERT INTO historial_actividad (fecha, usuario, accion, detalles) VALUES (?, ?, ?, ?)', [fecha, 'Admin', 'Modificación', actividad], (err) => {
                if (err) {
                    console.error("Error al registrar la actividad:", err); // Verifica que no haya error al insertar la actividad
                    return res.status(500).json({ error: 'Error registrando la actividad' });
                }
                console.log("Actividad registrada correctamente");
            });

            res.json({ message: 'Producto modificado exitosamente' });
        }
    );
});

// Ruta para eliminar un producto
app.delete('/deleteproduct/:id', (req, res) => {
    const { id } = req.params;

    // Eliminar el producto de la base de datos
    db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el producto' });
        }

        // Registrar la actividad de eliminación
        const actividad = `Producto con ID ${id} eliminado`;
        const fecha = new Date();
        db.query('INSERT INTO historial_actividad (fecha, usuario, accion, detalles) VALUES (?, ?, ?, ?)', [fecha, 'Admin', 'Eliminación', actividad], (err) => {
            if (err) {
                console.error("Error al registrar la actividad:", err); // Verifica que no haya error al insertar la actividad
                return res.status(500).json({ error: 'Error registrando la actividad' });
            }

            console.log("Actividad registrada correctamente");
        });

        res.json({ message: 'Producto eliminado exitosamente' });
    });
});

// Ruta para registrar un producto
app.post('/registerproduct', (req, res) => {
  const { nombre, cantidad, costo } = req.body;

  // Verificamos si todos los datos están presentes
  if (!nombre || !cantidad || !costo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const fecha_registro = new Date(); // Usamos la fecha actual como fecha de registro

  // Guardar el producto en la base de datos
  db.query('INSERT INTO productos (nombre, cantidad, precio, fecha_registro) VALUES (?, ?, ?, ?)', 
  [nombre, cantidad, costo, fecha_registro], 
  (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Error al registrar el producto' });
      }

      // Registrar la actividad de registro
      const actividad = `Producto '${nombre}' agregado con cantidad ${cantidad} y precio ${costo}`;
      const fecha = new Date();
      db.query('INSERT INTO historial_actividad (fecha, usuario, accion, detalles) VALUES (?, ?, ?, ?)', [fecha, 'Admin', 'Registro', actividad], (err) => {
        if (err) {
            console.error("Error al registrar la actividad:", err); // Verifica que no haya error al insertar la actividad
            return res.status(500).json({ error: 'Error registrando la actividad' });
        }

        console.log("Actividad registrada correctamente");
      });

      res.json({ message: 'Producto registrado exitosamente' });
  });
});

// Endpoint para obtener el historial de actividades
app.get('/get-activity-history', (req, res) => {
  db.query('SELECT * FROM historial_actividad ORDER BY fecha DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el historial' });
    }

    res.json(results);  // Retorna todas las actividades registradas
  });
});

// Iniciar servidor
app.get("/", (req, res) => {
  res.send("Servidor funcionando...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
