import React, { useState } from "react"
import { useQuery, useMutation, gql } from "@apollo/client"
import "./index.css"

export const GET_BOOKMARKS = gql`
  {
    bookmarks {
     url
     title
     description
    }
  }
`
export const ADD_BOOKMARK = gql`
  mutation addBookmark($title: String!, $url: String!, $description: String!){
    addBookmark(title: $title, url: $url, description: $description){
      title,
      url,
      description
  }
}
`

export default function Home() {

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")

  const submitBookmark = async (e) => {
    e.preventDefault();
    console.log("submitBookmark is running")
    const result = await addBookmark({
      variables: {
        title: title,
        url: url,
        description: description,
      },
      refetchQueries: [{ query: GET_BOOKMARKS }]
    })
    setUrl("");
    setDescription("");
    setTitle("");
    // console.log("Title in submitBookmark >>>>>>>>>>>>>>>:", title)
    // console.log("Description in submitBookmark >>>>>>>>>>>>>>>:", description)
    // console.log("URL in submitBookmark >>>>>>>>>>>>>>>:", url)
    console.log("Result in submitBookmark Func >>>>>>>>>>>:", result.data)
  }


  const { error, loading, data } = useQuery(GET_BOOKMARKS)
  const [addBookmark] = useMutation(ADD_BOOKMARK)

  console.log("Data in index.js page:", data)
  console.log("Error in index.js page:", error)


  if (loading) return <h1>Loading...</h1>
  if (error) return <h1> {error}</h1>



  // var arrayLength = data.getAllLollies.length

  return <div className="container">
    <h1>BOOKMARKS APPLICATION</h1>
    <form>
      Enter Title: <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} /> <br></br><br></br>
      Enter Description: <input type="text" name="description" value={description} onChange={e => setDescription(e.target.value)} /> <br></br><br></br>
      Enter URL: <input type="url" name="url" value={url} onChange={e => setUrl(e.target.value)} /><br></br>
      <br></br>
      <button onClick={(e) => submitBookmark(e)} >Add Bookmark</button>
      <br></br>
      <br></br>
    </form>


    <table className="table">
      <thead>
        <tr >
          <th>TITLE</th>
          <th>URL</th>
          <th>DESCRIPTION</th>
        </tr>
      </thead>



     {data &&  <tbody>
        {data.bookmarks.map((bookmark, index) => {
          return (
            <tr key={index}>
              <td>{bookmark.title}</td>
              <td>{bookmark.url}</td>
              <td>{bookmark.description}</td>
            </tr>
          )
        })}
      </tbody>
}
    </table>


  </div>
}
