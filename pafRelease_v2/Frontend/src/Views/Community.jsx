import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/community.css";
import CenterSection from "../Components/Community/CenterSection";
import UserProfileModal from "../Components/Modals/UserProfileModal";
import CreateStoryModal from "../Components/Modals/CreateStoryModal";
import WorkoutStory from "../Components/Modals/UpdateStory";
import StoryService from "../Services/StoryService";
import state from "../Utils/Store";
import { useSnapshot } from "valtio";
import CreatePostModal from "../Components/Modals/CreatePostModal";
import UserService from "../Services/UserService";
import UploadPostModal from "../Components/Modals/UploadPostModal";
import CreateLearningProgressModal from "../Components/Modals/CreateLearningProgressModal";
import LearningProgressService from "../Services/LearningProgressService";
import EditLearningProgressModal from "../Components/Modals/EditLearningProgressModal";
import UpdateSkillShareModal from "../Components/Modals/UpdateSkillShareModal";
import CreateSkillShareModal from "../Components/Modals/CreateSkillShareModal";
import SkillShareService from "../Services/SkillShareService";
import FriendProfileModal from "../Components/Modals/FriendProfileModal";
import { message } from "antd";

const Community = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);

  const getWorkoutStories = async () => {
    try {
      const response = await StoryService.getAllWorkoutStories();
      state.storyCards = response;
    } catch (error) {
      console.log("Failed to fetch workout stories", error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await UserService.getProfiles();
      state.users = response;
    } catch (error) {
      console.log("Failed to fetch users", error);
    }
  };

  const getWorkoutPlans = async () => {
    try {
      const response = await LearningProgressService.getAllWorkoutPlans();
      state.workoutPlans = response;
    } catch (error) {
      console.log("Failed to fetch Learning Progresss ", error);
    }
  };

  const getMealPlans = async () => {
    try {
      const response = await SkillShareService.getAllMealPlans();
      state.mealPlans = response;
    } catch (error) {
      console.log("Failed to fetch Skill Shares", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      UserService.getProfile()
        .then((response) => {
          state.currentUser = response;
          message.success("Welcome");
        })
        .catch(() => {
          message.error("Failed to fetch user profile");
        });
    }
    getAllUsers().then(() => {
      getWorkoutStories();
      getWorkoutPlans();
      getMealPlans();
    });
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <header className="">
        <nav>
          <div className="nav__header">
            <div className="nav__logo">
              <Link to="#">
                <img src="/assets/logo.png" alt="logo" />
                
              </Link>
            </div>
            <div className="nav__menu__btn" id="menu-btn">
              <span>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
          <ul className="nav__links" id="nav-links">
            <li className="link">
              
            </li>
            <li className="link">
              <Link to="#browse-skills"></Link>
            </li>
            <li className="link">
              <Link
                to="/community"
                onClick={() => {
                  if (!localStorage.getItem("userId")) {
                    setIsAuthModalOpened(true); // Open authentication modal if not logged in
                  }
                }}
              >
               
              </Link>
            </li>
            <li className="link">
              
            </li>
          </ul>
        </nav>
      </header>

      <div className="main">
        <CenterSection />
      </div>

      <UserProfileModal />
      <CreateStoryModal />
      <CreateLearningProgressModal />
      <CreateSkillShareModal />
      {snap.selectedWorkoutStory && <WorkoutStory />}
      <CreatePostModal />
      {snap.selectedPost && <UploadPostModal />}
      {snap.selectedWorkoutPlan && <EditLearningProgressModal />}
      {snap.seletedMealPlanToUpdate && <UpdateSkillShareModal />}
      {snap.selectedUserProfile && <FriendProfileModal />}
    </div>
  );
};

export default Community;
