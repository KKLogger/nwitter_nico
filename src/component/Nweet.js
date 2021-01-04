import React from "react";
import { dbService, storageService } from "../fbase";

const Nweet = ({ nweetObj, isOwner }) => {
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you want to delete");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.attachmentUrl).delete();
    }
  };
  const [isEditing, setIsEditing] = React.useState(false);
  const [newNweet, setNewNweet] = React.useState(nweetObj.text);
  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });
    /*아래와 같은 방식으로 하면 firebase 자체의 값이 update  되지는 않는다.
    nweetObj.text = newNweet;*/
    setIsEditing(false);
    setNewNweet(nweetObj.text);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  return (
    <div>
      {isEditing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input value={newNweet} required onChange={onChange} />
                <input type="submit" value="submit" />
              </form>
              <button onClick={toggleEditing}>cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} width={"50px"} height={"50px"} />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Update</button>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default Nweet;
