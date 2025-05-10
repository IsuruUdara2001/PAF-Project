import React, { useEffect, useState } from "react";
import UserService from "../../Services/UserService";
import state from "../../Utils/Store";

const StoryCard = ({ card }) => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    UserService.getProfileById(card.userId)
      .then((value) => {
        setUserData(value);
      })
      .catch((err) => {
        console.log(`error getting user data ${err}`);
      });
  }, [card]);

  // Check if this story has been viewed (add a viewed property to your cards if needed)
  const viewed = card.viewed || false;

  return (
    <div
      className="story-item"
      onClick={() => {
        state.selectedWorkoutStory = card;
        state.workoutStoryOpen = true;
      }}
    >
      <div className={`story-circle ${viewed ? 'viewed' : ''}`}>
        <img 
          className="story-avatar" 
          alt={userData?.username || "user"} 
          src={userData?.image} 
        />
      </div>
      <p className="story-username">{userData?.username}</p>
    </div>
  );
};

export default StoryCard;