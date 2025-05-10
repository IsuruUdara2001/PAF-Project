import React, { useEffect, useState } from "react";
import {
  Modal,
  Upload,
  Input,
  Button,
  DatePicker,
  message,
  Select,
  Form,
  Slider,
  Typography
} from "antd";
import { 
  UploadOutlined, 
  ClockCircleOutlined, 
  FireOutlined 
} from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import StoryService from "../../Services/StoryService";
import moment from "moment";

const uploader = new UploadFileService();
const { Option } = Select;
const { Text } = Typography;

const UpdateStory = () => {
  const snap = useSnapshot(state);
  const workoutStory = snap.selectedWorkoutStory;
  const userId = snap.currentUser?.id;
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form] = Form.useForm();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timestamp: null,
    exerciseType: "",
    timeDuration: 30,
    intensity: "",
    image: ""
  });

  useEffect(() => {
    if (workoutStory) {
      setFormData({
        title: workoutStory.title || "",
        description: workoutStory.description || "",
        timestamp: workoutStory.timestamp ? moment(workoutStory.timestamp) : null,
        exerciseType: workoutStory.exerciseType || "",
        timeDuration: workoutStory.timeDuration || 30,
        intensity: workoutStory.intensity || "",
        image: workoutStory.image || ""
      });
      
      form.setFieldsValue({
        title: workoutStory.title,
        description: workoutStory.description,
        timestamp: workoutStory.timestamp ? moment(workoutStory.timestamp) : null,
        exerciseType: workoutStory.exerciseType,
        timeDuration: workoutStory.timeDuration || 30,
        intensity: workoutStory.intensity
      });
    }
  }, [workoutStory, form]);

  const handleUpdateStory = async () => {
    try {
      setLoading(true);
      const body = {
        ...formData,
        image: uploadedImage || workoutStory.image,
      };
      
      await StoryService.UpdateStory(workoutStory.id, body);
      state.storyCards = await StoryService.getAllWorkoutStories();
      message.success("Learning Plan updated successfully");
      
      state.workoutStoryOpen = false;
    } catch (error) {
      message.error("Error updating Learning Plan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await StoryService.deleteWorkoutStory(workoutStory.id);
      state.storyCards = await StoryService.getAllWorkoutStories();
      state.workoutStoryOpen = false;
      message.success("Learning Plan deleted successfully");
    } catch (error) {
      message.error("Failed to delete Learning Plan");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      try {
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "workoutStories"
        );
        setUploadedImage(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      timestamp: date,
    });
  };

  const handleIntensityChange = (value) => {
    setFormData({
      ...formData,
      intensity: value,
    });
  };

  // Duration markers for slider
  const durationMarks = {
    0: '0m',
    30: '30m',
    60: '1h',
    90: '1.5h',
    120: '2h'
  };

  // Function to get intensity color based on duration
  const getIntensityColor = (duration) => {
    if (duration < 15) return '#52c41a';     // Light green - Easy
    if (duration < 30) return '#1890ff';     // Blue - Moderate
    if (duration < 60) return '#faad14';     // Orange - Intense
    return '#f5222d';                        // Red - Very Intense
  };

  return (
    <Modal
      title="Update Learning Plan"
      open={snap.workoutStoryOpen}
      onCancel={() => {
        state.workoutStoryOpen = false;
      }}
      width={500}
      bodyStyle={{ 
        padding: '15px', 
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}
      footer={[
        userId === workoutStory?.userId && (
          <div 
            key="editingButtons" 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '5px'
            }}
          >
            <Button 
              key="cancel" 
              onClick={() => (state.workoutStoryOpen = false)}
            >
              Cancel
            </Button>
            <div>
              <Button
                loading={deleteLoading}
                danger
                key="delete"
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                loading={loading}
                key="submit"
                type="primary"
                onClick={handleUpdateStory}
              >
                Update
              </Button>
            </div>
          </div>
        ),
      ]}
    >
      {userId !== workoutStory?.userId ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ 
            maxHeight: 250, 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={workoutStory?.image} 
              style={{ 
                width: '100%', 
                height: 'auto', 
                objectFit: 'cover' 
              }} 
              alt="Learning Plan" 
            />
          </div>
          <div style={{ 
            width: '100%', 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '8px',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            <p style={{ margin: 0 }}><strong>Title:</strong> {workoutStory?.title}</p>
            <p style={{ margin: 0 }}><strong>Date:</strong> {workoutStory?.timestamp ? moment(workoutStory.timestamp).format('YYYY-MM-DD') : 'N/A'}</p>
            <p style={{ margin: 0 }}><strong>Exercise:</strong> {workoutStory?.exerciseType || 'N/A'}</p>
            <p style={{ margin: 0 }}><strong>Duration:</strong> {workoutStory?.timeDuration || 0} min</p>
            <p style={{ gridColumn: 'span 2', margin: 0 }}><strong>Intensity:</strong> {workoutStory?.intensity || 'N/A'}</p>
            <p style={{ gridColumn: 'span 2', margin: 0 }}><strong>Description:</strong> {workoutStory?.description}</p>
          </div>
        </div>
      ) : (
        <Form 
          form={form} 
          layout="vertical"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px' 
          }}
        >
          <div style={{ 
            maxHeight: 250, 
            marginBottom: "0.5rem",
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <img
              style={{ 
                width: "100%", 
                height: "auto", 
                maxHeight: 250,
                objectFit: 'cover'
              }}
              src={uploadedImage || workoutStory?.image}
              alt="Learning Plan"
            />
          </div>
          
          <Form.Item label="Title" name="title" style={{ marginBottom: 0 }}>
            <Input
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </Form.Item>
          
          <Form.Item label="Timestamp" name="timestamp" style={{ marginBottom: 0 }}>
            <DatePicker
              placeholder="Timestamp"
              style={{ width: "100%" }}
              value={formData.timestamp}
              onChange={handleDateChange}
            />
          </Form.Item>
          
          <Form.Item label="Exercise Type" name="exerciseType" style={{ marginBottom: 0 }}>
            <Input
              placeholder="Exercise Type"
              name="exerciseType"
              value={formData.exerciseType}
              onChange={handleInputChange}
            />
          </Form.Item>
          
          <Form.Item 
            label="Time Duration" 
            name="timeDuration"
            style={{ marginBottom: 0 }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '8px'
            }}>
              <ClockCircleOutlined 
                style={{ 
                  fontSize: '20px', 
                  color: getIntensityColor(formData.timeDuration) 
                }} 
              />
              <div style={{ flex: 1 }}>
                <Slider
                  min={0}
                  max={120}
                  step={15}
                  value={formData.timeDuration}
                  marks={durationMarks}
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      timeDuration: value,
                    });
                  }}
                  tipFormatter={(value) => `${value} min`}
                />
              </div>
              <Text 
                strong 
                style={{ 
                  color: getIntensityColor(formData.timeDuration),
                  minWidth: '40px',
                  textAlign: 'right'
                }}
              >
                {formData.timeDuration} min
              </Text>
            </div>
          </Form.Item>

          <Form.Item label="Intensity" name="intensity" style={{ marginBottom: 0 }}>
            <Select
              placeholder="Select Intensity"
              style={{ width: "100%" }}
              value={formData.intensity}
              onChange={handleIntensityChange}
              suffixIcon={<FireOutlined />}
            >
              <Option value="No Efforts">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FireOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  No Efforts
                </div>
              </Option>
              <Option value="Mid Efforts">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FireOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                  Mid Efforts
                </div>
              </Option>
              <Option value="Moderate Efforts">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FireOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                  Moderate Efforts
                </div>
              </Option>
              <Option value="Severe Efforts">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FireOutlined style={{ color: '#f5222d', marginRight: '8px' }} />
                  Severe Efforts
                </div>
              </Option>
              <Option value="Maximal Efforts">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FireOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                  Maximal Efforts
                </div>
              </Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Description" name="description" style={{ marginBottom: 0 }}>
            <Input.TextArea
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </Form.Item>
          
          {imageUploading ? (
            <p>Image is uploading</p>
          ) : (
            <Upload
              accept="image/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
            >
              <Button 
                icon={<UploadOutlined />} 
                type="dashed"
                style={{ width: '100%' }}
              >
                Upload New Image
              </Button>
            </Upload>
          )}
        </Form>
      )}
    </Modal>
  );
};

export default UpdateStory;