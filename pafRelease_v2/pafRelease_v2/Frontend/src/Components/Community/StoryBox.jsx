import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import StoryCard from "./StoryCard";
import "../../Styles/center_section.css";

const StoryBox = () => {
  const snap = useSnapshot(state);
  
  return (
    <div className="stories-container">
      <p className="stories-heading">Learning Plan Sharing</p>
      
      <div className="stories-row">
        <div 
          className="story-item create-story"
          onClick={() => {
            state.createWorkoutStatusModalOpened = true;
          }}
        >
          <div className="story-circle">
            <img 
              className="story-avatar" 
              alt="user-profile" 
              src={snap.currentUser?.image} 
            />
            <div className="story-plus">+</div>
          </div>
          <p className="story-username">Create</p>
        </div>
        
        {snap.storyCards && snap.storyCards.map((card) => (
          <StoryCard key={card?.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default StoryBox;