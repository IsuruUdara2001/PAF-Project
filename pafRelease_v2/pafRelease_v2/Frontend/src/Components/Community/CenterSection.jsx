import React, { useEffect } from "react";
import { useSnapshot } from "valtio";
import { Tabs, Avatar, Row, Col, Typography, Divider } from "antd";
import {
  UserOutlined,
  BellOutlined,
  TeamOutlined,
  BulbOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import "../../Styles/center_section.css";
import StoryBox from "./StoryBox";
import MyPost from "./MyPostBox";
import FriendsPost from "./FriendsPost";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import LearningProgressBox from "./LearningProgressBox";
import LearningProgressCard from "./LearningProgressCard";
import SkillShareBox from "./SkillShareBox";
import SkillShareCard from "./SkillShareCard";
import FriendsSection from "./FriendsSection";
import NotificationsDropdown from "./NotificationsDropdown";

const { TabPane } = Tabs;
const { Title } = Typography;

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
    <div className="learnify-center">
      {/* Header Bar */}
      <header className="learnify-header">
        <Title level={3} className="learnify-title">
          <BulbOutlined style={{ color: "#5c51e0", marginRight: 10 }} />
          Learnify
        </Title>
        <div className="learnify-header-actions">
          <NotificationsDropdown />
          <Avatar
            style={{
              cursor: "pointer",
              border: "3px solid #e75187",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              marginLeft: 16,
            }}
            onClick={() => {
              state.profileModalOpend = true;
            }}
            size={54}
            src={snap.currentUser?.image}
            icon={!snap.currentUser?.image && <UserOutlined />}
          />
        </div>
      </header>

      {/* Stories */}
      <StoryBox />

      {/* Main Card */}
      <div className="learnify-main-card">
        <Tabs
          defaultActiveKey="1"
          tabBarGutter={24}
          tabBarStyle={{ fontWeight: "bold", fontSize: 16 }}
          items={[
            {
              key: "1",
              label: (
                <span>
                  <ShareAltOutlined /> Explore
                </span>
              ),
              children: (
                <>
                  <MyPost />
                  <div>
                    {snap.posts.map((post) => (
                      <FriendsPost key={post?.id} post={post} />
                    ))}
                  </div>
                </>
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  <BulbOutlined /> Learning Progress
                </span>
              ),
              children: (
                <>
                  <LearningProgressBox />
                  <div>
                    {snap.workoutPlans.map((plan) => (
                      <LearningProgressCard key={plan.id} plan={plan} />
                    ))}
                  </div>
                </>
              ),
            },
            {
              key: "3",
              label: (
                <span>
                  <TeamOutlined /> SkillShare
                </span>
              ),
              children: (
                <>
                  <SkillShareBox />
                  <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
                    {snap.mealPlans.map((plan) => (
                      <Col xs={24} sm={12} md={8} lg={8} key={plan.id}>
                        <SkillShareCard plan={plan} />
                      </Col>
                    ))}
                  </Row>
                </>
              ),
            },
            {
              key: "4",
              label: (
                <span>
                  <TeamOutlined /> Friends
                </span>
              ),
              children: <FriendsSection />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default CenterSection;