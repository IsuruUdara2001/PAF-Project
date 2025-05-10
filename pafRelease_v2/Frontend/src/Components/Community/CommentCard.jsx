import React, { useEffect, useState } from "react";
import { List, Avatar, Spin, Typography, Tooltip } from "antd";
import axios from "axios";
import UserService from "../../Services/UserService";
import { BASE_URL } from "../../constants";
import state from "../../Utils/Store";

const { Text } = Typography;

const CommentCard = ({ comment }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Avoid state update on unmounted component

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        // First, get user profile (you may not need both calls if UserService returns all data)
        const userProfile = await UserService.getProfileById(comment.userId);
        // Second, get more user data (e.g., avatar, name)
        const userDetails = await axios.get(
          `${BASE_URL}/users/${userProfile.userId}`,
          config
        );

        if (isMounted) {
          setUserData({ ...userDetails.data, ...userProfile });
        }
      } catch (err) {
        if (isMounted) setError("Error loading user data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [comment.userId]);

  return (
    <List.Item style={{ padding: "12px 0" }} key={comment.id}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
          gap: 16,
        }}
      >
        {loading ? (
          <Spin size="small" />
        ) : error ? (
          <Avatar icon="?" />
        ) : (
          <Tooltip title={userData?.username || "User"}>
            <Avatar
              src={userData?.image}
              alt={userData?.username}
              style={{ cursor: "pointer" }}
              onClick={() => {
                state.selectedUserProfile = userData;
                state.friendProfileModalOpened = true;
              }}
            />
          </Tooltip>
        )}

        <div style={{ flex: 1 }}>
          <div>
            <Text strong>
              {userData?.username || "Unknown User"}
            </Text>
            <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleString()
                : ""}
            </Text>
          </div>
          <div style={{ marginTop: 4 }}>
            <Text>{comment.commentText}</Text>
          </div>
        </div>
      </div>
    </List.Item>
  );
};

export default CommentCard;