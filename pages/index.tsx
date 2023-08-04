import React from 'react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

import Navbar from '@/components/Navbar';
import { MovieInterface } from '@/types';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  const movies = await prismadb.movie.findMany();

  const serializedMovies = movies.map((movie) => ({
    ...movie,
  }));

  return {
    props: {
      movies: serializedMovies,
    },
  };
}

const Home = ({movies}:{movies : MovieInterface[]}) => {

  return (
    <>
      
      
      <div className="pb-40">
        {movies.map((movie) => (
          <div key={movie.id} className=''>

            <h2 className="text-white hover:text-gray-500 cursor-pointer ">{movie.id}</h2>
            <h2 className="text-white hover:text-gray-500 cursor-pointer ">{movie.title}</h2>
            <h2 className="text-white hover:text-gray-500 cursor-pointer ">{movie.duration}</h2>
            <img src={movie.thumbnailUrl} alt="" />
          </div>
            
         
         ))}
      </div>
    </>
  )
}

export default Home;
