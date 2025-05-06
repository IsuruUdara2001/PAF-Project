import React, { useState } from "react";
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



const CreateStoryModal = () => {
  const snap = useSnapshot(state);

  const [imageUploading, setImageUploading] = useState(false);

  const [uploadedImage, setUploadedImage] = useState(null);

  const [loading, setLoading] = useState(false);

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


  // Duration markers for slider (same as in UpdateStory)


  const durationMarks = {

    0: '0 min',

    15: '15 min',

    30: '30 min',

    45: '45 min',

    60: '1 hr',

    90: '1.5 hr',

    120: '2 hr'

  };

  // Function to get intensity color based on duration (same as in UpdateStory)
  const getIntensityColor = (duration) => {
    if (duration < 15) return '#52c41a';     // Light green - Easy
    if (duration < 30) return '#1890ff';     // Blue - Moderate
    if (duration < 60) return '#faad14';     // Orange - Intense
    return '#f5222d';                        // Red - Very Intense
  };

  const handleCreateWorkoutStory = async () => {
    try {
      setLoading(true);
      const body = {
        ...formData,
        image: uploadedImage,
        userId: snap.currentUser?.uid,
      };
      
      await StoryService.createWorkoutStory(body);
      state.storyCards = await StoryService.getAllWorkoutStories();
      message.success("Learning Plan created successfully");
      
      // Reset form and modal
      form.resetFields();
      setUploadedImage(null);
      state.createWorkoutStatusModalOpened = false;
    } catch (error) {
      message.error("Error creating Learning Plan");
    } finally {
      setLoading(false);
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

  return (
    <Modal
      title="Create Learning Plan"
      open={snap.createWorkoutStatusModalOpened}
      onCancel={() => {
        state.createWorkoutStatusModalOpened = false;
      }}
      width={600}
      bodyStyle={{ 
        padding: '20px', 
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}
      footer={[
        <div 
          key="actionButtons" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '10px'
          }}
        >
          <Button 
            key="cancel" 
            onClick={() => (state.createWorkoutStatusModalOpened = false)}
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            key="create"
            type="primary"
            onClick={handleCreateWorkoutStory}
          >
            Create
          </Button>
        </div>
      ]}
    >
      <Form 
        form={form} 
        layout="vertical"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px' 
        }}
      >
        {uploadedImage && (
          <div style={{ 
            maxHeight: 400, 
            marginBottom: "1rem",
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <img
              style={{ 
                width: "100%", 
                height: "auto", 
                maxHeight: 400,
                objectFit: 'cover'
              }}
              src={uploadedImage}
              alt="Learning Plan"
            />
          </div>
        )}
        
        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input a title' }]}>
          <Input
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </Form.Item>
        
        <Form.Item label="Timestamp" name="timestamp">
          <DatePicker
            placeholder="Timestamp"
            style={{ width: "100%" }}
            value={formData.timestamp}
            onChange={handleDateChange}
          />
        </Form.Item>
        
        <Form.Item label="Exercise Type" name="exerciseType">
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
            padding: '15px',
            borderRadius: '8px'
          }}>
            <ClockCircleOutlined 
              style={{ 
                fontSize: '24px', 
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
                minWidth: '50px',
                textAlign: 'right'
              }}
            >
              {formData.timeDuration} min
            </Text>
          </div>
        </Form.Item>

        <Form.Item label="Intensity" name="intensity">
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
        
        <Form.Item label="Description" name="description">
          <Input.TextArea
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
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
              Upload Image
            </Button>
          </Upload>
        )}
      </Form>
    </Modal>
  );
};

export default CreateStoryModal;