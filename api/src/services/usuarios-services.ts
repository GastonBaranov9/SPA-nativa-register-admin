import { Usuario } from "../model/usuariomodel.ts";
import * as err from "../model/errorsmodel.ts";

export const usuarios = [
  {
    id_usuario: 1,
    nombre: "Gaston",
    apellido: "Baranov",
    password: "gastonbaranov",
    edad: 27,
    isAdmin: true,
  },
  {
    id_usuario: 2,
    nombre: "Indrianne",
    apellido: "Gomez",
    password: "indriannegomez",
    edad: 22,
    isAdmin: false,
  },
];

let ultimoid = usuarios.length + 1;

export async function getAll(): Promise<Usuario[]> {
  return usuarios;
}

export async function getById(id_usuario: number): Promise<Usuario> {
  const usuario = usuarios.find((u) => u.id_usuario === id_usuario);
  if (!usuario) throw new err.errorNoEncontrado();
  return usuario;
}

export async function getOneBy(data: Partial<Usuario>): Promise<Usuario> {
  const usuario = usuarios.find((u) => {
    Object.entries(data).every(
      ([key, value]) => u[key as keyof Usuario] === value
    );
  });
  if (!usuario) throw new err.errorNoEncontrado();
  return usuario;
}
export async function findAll(data: Partial<Usuario>): Promise<Usuario[]> {
  return usuarios.filter((u) =>
    Object.entries(data).every(
      ([key, value]) => u[key as keyof Usuario] === value
    )
  );
}

export async function create(
  data: Omit<Usuario, "id_usuario">
): Promise<Usuario> {
  const usuarioNuevo: Usuario = {
    id_usuario: ultimoid++,
    nombre: data.nombre,
    apellido: data.apellido,
    isAdmin: data.isAdmin,
    edad: data.edad,
    password: data.password,
  };
  usuarios.push(usuarioNuevo);
  return usuarioNuevo;
}

export async function erase(id_usuario: number): Promise<void> {
  const index = usuarios.findIndex((u) => u.id_usuario == id_usuario);
  if (index === -1) {
    throw new err.errorNoEncontrado();
  }
  usuarios.splice(index, 1);
}

export async function update(
  id_usuario: number,
  data: Partial<Usuario>
): Promise<Usuario> {
  const usuario = await getById(id_usuario);
  if (!usuario) throw new err.errorNoEncontrado();

  if (data.nombre) usuario.nombre = data.nombre;

  if (data.isAdmin) usuario.isAdmin = data.isAdmin;
  return usuario;
}
