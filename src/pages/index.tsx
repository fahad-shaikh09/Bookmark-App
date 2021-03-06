import React, { useState } from "react"
import { useQuery, useMutation, gql } from "@apollo/client"


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
  const [updated, setUpdated] = useState(false)


  // const handleSubmit = async () => {
  // console.log("To:", toField);
  // console.log("From:", fromField);
  // console.log("Message:", message);
  // console.log("title:", title)
  // console.log("url:", url)
  // console.log("description:", description)

  // addBookmark({
  //   variables: {
  //     title,
  //     url,
  //     description,
  //   },
  //   refetchQueries: [{ query: GET_BOOKMARKS }]
  // })
  // }



  const submitBookmark = async () => {
    const result = await addBookmark({
      variables: {
        title: title,
        url: url,
        description: description,
      },
      refetchQueries: [{ query: GET_BOOKMARKS }]
    })

    console.log("Result in submitBookmark func >>>>>>>>>>>>>:", result)
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
      Enter URL: <input type="text" name="url" value={url} onChange={e => setUrl(e.target.value)} /><br></br>
      <br></br>
      <button onClick={() => submitBookmark()} >Add Bookmark</button>

    </form>
  </div>
}
