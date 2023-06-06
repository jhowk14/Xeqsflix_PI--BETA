import { useState } from 'react';
import { Movie, User } from "@prisma/client";
import { PrismaClient } from '@prisma/client';
import useCurrentUser from '@/hooks/useCurrentUser';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

const InfosFind = ({ users, movies }: { users: User[], movies: Movie[] }) => {
  const [showMovies, setShowMovies] = useState(false);

  const handleClickUsers = () => {
    setShowMovies(false);
  };

  const handleClickMovies = () => {
    setShowMovies(true);
  };

  return (
    <>
      <div className="flex bg-black h-screen">
        <aside className="bg-gray-900 text-gray-300 w-64 flex-shrink-0">
        <link href="http://localhost:3000" /><img src="/images/logo.png" className="" alt="Logo" /><link/>
          <nav className="text-sm">
            <a href="#" className="block p-4 hover:bg-gray-700" onClick={handleClickUsers}>Usuários</a>
            <a href="#" className="block p-4 hover:bg-gray-700" onClick={handleClickMovies}>Movies</a>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-4">Bem-vindo(a) ao Dashboard Administrativo</h2>
          <div className="bg-gray-900 p-4 rounded shadow text-white">
            <h3 className="text-xl font-semibold mb-4">Lista de {showMovies ? 'Movies' : 'Usuários'}</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>{showMovies? 'Duração' : 'Email'}</th>
                </tr>
              </thead>
              <tbody>
                {showMovies ? (
                  movies.map((movie) => (
                    <tr key={movie.id} className="border-b">
                      <td className="py-2 px-4">{movie.id}</td>
                      <td className="py-2 px-4">{movie.title}</td>
                      <td className="py-2 px-4">{movie.duration}</td>
                    </tr>
                  ))
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2 px-4">{user.id}</td>
                      <td className="py-2 px-4">{user.name}</td>
                      <td className="py-2 px-4">{user.email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  
  const users = await prisma.user.findMany({
    where: {
      emailVerified: { not: null },
    },
  });

  const movies = await prisma.movie.findMany();

  const serializedUsers = users.map((user) => ({
    ...user,
    createdAt: user.createdAt?.toISOString(),
    emailVerified: user.emailVerified?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  }));

  const serializedMovies = movies.map((movie) => ({
    ...movie,
  }));

  return {
    props: {
      users: serializedUsers,
      movies: serializedMovies,
    },
  };
}

export default InfosFind;
