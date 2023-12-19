import './App.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

function App() {
   const [data, setData] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // Make initial call to get posts
            const responsePosts = await fetch('https://jsonplaceholder.typicode.com/posts');
            const postsData = await responsePosts.json();

            // Make additional call for each post to retrieve comments
            // Return new array with comments added to each post object
            const promises = postsData.slice(0, 12).map(async (post) => {
               const responseComments = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
               const commentsData = await responseComments.json();
               return {
                  post,
                  comments: commentsData,
               };
            });

            // Wait for all promises to resolve
            const updatedData = await Promise.all(promises);

            // Update state with final data
            setData(updatedData);
         } catch (error) {
            console.error('Error fetching data:', error);
         }
      };
      fetchData();
   }, []);

   return (
      <div className="container">
         <h1>React: API Fetch Chaining</h1>
         <div className="posts-container">
            {data.map((item, index) => (
               <div className="post" key={index}>
                  {/* <FontAwesomeIcon icon={faNewspaper} size="2x" color="#007bff" /> */}
                  <h2>ID: {item.post.id} {item.post.title}</h2>
                  <p>{item.post.body}</p>
                  <h3>Comments:</h3>
                  <ul>
                     {item.comments.map((comment) => (
                        <li key={comment.id}>{comment.body}</li>
                     ))}
                  </ul>
               </div>
            ))}
         </div>
      </div>
   );
}

export default App;
