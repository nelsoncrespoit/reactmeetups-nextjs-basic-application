import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';


function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name='description'
          content='Browse a huge list of highly active React meetups!'
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// this kind of function only works in our page components files inside the pages folder
// NextJS look for this kind of functions by their name and if it finds some then, 
// executes it during the pre-rendering process

// before calling or executing the component function it will execute getStaticProps - it has this name because indee
// its job is to prepare props for this page and these props could contain data this page needs
// inside getStaticProps we could run any code that normally will run on the server
// but we could access a file system or securely connect to a database
// all the code executed in here will never end on the client side because this code is executed during the building process
// not on the server and less on the client
// It is mandatory to return an object here
// DATA FETCHING FOR PRE-RENDERING


export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect('mongodb+srv://maritzap70:eYN24yojh6UgejcO@cluster0.ciea5h4.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();

  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}


// As an alternative to getStaticProps we could really want to regenerate a page for every incoming request
// So we want to pre-generate the page dynamically on the fly after deployment on the server
// not during the building process and not every couple of seconds but for every request
// It runs always on the server after deployment

// export async function getServerSideProps(){
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   };
// }

export default HomePage;