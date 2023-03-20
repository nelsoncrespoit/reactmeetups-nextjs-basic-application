import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';

import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect('mongodb+srv://maritzap70:eYN24yojh6UgejcO@cluster0.ciea5h4.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}


export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect('mongodb+srv://maritzap70:eYN24yojh6UgejcO@cluster0.ciea5h4.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();
  const meetupsCollection = db.collection('meetups');


  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();


  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;


// export async function getStaticProps(context){
//     // fetch data for a single meetup
//     // there are a lof data encoded into the URL, the ID for example
//     // but useRouter is a hook and only can be used on components functions, we need using context
//     // in this case context will not hold a request or a response but it has for example a params key
//     // and the will be an object where our identifiers between the square brackets will be properties 
//     // and the values will be the actual values encoded in the URL 
    
//     const meetupId = context.params.meetupId;
//     //console.log(meetupId);

//     const client = await MongoClient.connect('mongodb+srv://maritzap70:eYN24yojh6UgejcO@cluster0.ciea5h4.mongodb.net/meetups?retryWrites=true&w=majority');
//     const db = client.db();
//     const meetupsCollections = db.collection('meetups');

//     const selectedMeetup = await meetupsCollections.findOne( { _id: ObjectId(meetupId), });
//     client.close();

//     return {
//         props: {
//             meetupData: {
//                 id: selectedMeetup._id.toString(),
//                 title: selectedMeetup.title,
//                 address: selectedMeetup.address,
//                 image: selectedMeetup.image,
//                 description: selectedMeetup.description,
//             },
//         }
//     }
// }

// export default MeetupDetails;