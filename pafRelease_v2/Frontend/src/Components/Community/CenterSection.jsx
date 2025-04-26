import React, { useEffect } from "react";
import "../../Styles/center_section.css";
import StoryBox from "./StoryBox";
import MyPost from "./MyPostBox";
import FriendsPost from "./FriendsPost";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import LearningProgressBox from "./LearningProgressBox";
import LearningProgressCard from "./LearningProgressCard";
import CreaetMealPlanBox from "./SkillShareBox";
import SkillShareCard from "./SkillShareCard";
import FriendsSection from "./FriendsSection";
import NotificationsDropdown from "./NotificationsDropdown"
import { Tabs, Avatar, Row, Col } from "antd";

const { TabPane } = Tabs;

const CenterSection = () => {
  const snap = useSnapshot(state);
  
  useEffect(() => {
    PostService.getPosts()
      .then((result) => {
        state.posts = result;
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, []);
  
  return (
    <div className="center" style={{ 
      width: "100%", 
      maxWidth: "1200px", 
      margin: "0 auto",
      padding: "0 16px"
    }}>
      <nav
        // style={{
        //   height: "70px",
        //   width: "100%",
        //   marginBottom: "16px",
        //   display: "flex",
        //   justifyContent: "space-between",
        //   alignItems: "center",
        //   padding: "8px 16px",
        //   backgroundColor: "#45684551",
        //   borderRadius: "8px",
        //   boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        // }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          
          
        </div>
        <Avatar
          style={{ 
            cursor: "pointer", 
            border: "5px solidrgb(223, 27, 86)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
          onClick={() => {
            state.profileModalOpend = true;
          }}
          size={60}
          src={snap.currentUser?.image}
        />
      </nav>
      
      <StoryBox />
      
      <div style={{ 
        backgroundColor: "#fff", 
        borderRadius: "8px", 
        padding: "16px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "16px"
      }}>
        <NotificationsDropdown />
        <Tabs 
          defaultActiveKey="1"
          style={{ width: "100%" }}
          tabBarStyle={{ marginBottom: "16px", fontWeight: "600" }}
        >
          <TabPane tab="Explore" key="1">
            <MyPost />
            <div>
              {snap.posts.map((post) => {
                return <FriendsPost key={post?.id} post={post} />;
              })}
            </div>
          </TabPane>
          
          <TabPane tab="Learning Progress Updates" key="2">
            <LearningProgressBox />
            <div>
              {snap.workoutPlans.map((plan) => (
                <LearningProgressCard key={plan.id} plan={plan} />
              ))}
            </div>
          </TabPane>
          
          <TabPane tab="SkillShare" key="3">
            <CreaetMealPlanBox />
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              {snap.mealPlans.map((plan) => (
                <SkillShareCard key={plan.id} plan={plan} />
              ))}
            </Row>
          </TabPane>
          
          <TabPane tab="Friends" key="4">
            <FriendsSection />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default CenterSection;