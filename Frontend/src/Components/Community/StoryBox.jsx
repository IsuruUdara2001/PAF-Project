import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import StoryCard from "./StoryCard";

const StoryBox = () => {
  const snap = useSnapshot(state);
  return (
    <div>
      <p style={{ fontWeight: "bold", fontSize: "30px" }}>Learning Plan Sharing</p>

      <div class="top_box">
        <div
          onClick={() => {
            state.createWorkoutStatusModalOpened = true;
          }}
          class="my_story_card"
        >
          

          <div class="story_upload">
           <br></br>
          
            
          </div>
        </div>
        {snap.storyCards.map((card) => (
          <StoryCard key={card?.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default StoryBox;
