import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningProgressService from "../../Services/LearningProgressService";

const CreateLearningProgressModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Create Learning Progress data object
      const workoutPlanData = {
        userId: snap.currentUser?.uid,
        planName: values.planName,
        description: values.description,
        goal: values.goal,
        routines: values.routines,
      };

      await LearningProgressService.CreateLearningProgressModal(workoutPlanData);
      state.workoutPlans = await LearningProgressService.getAllWorkoutPlans();
      
      // Success message
      message.success("Learning Progress created successfully!");

      // Reset form and close modal
      form.resetFields();
      state.CreateLearningProgressModalOpened = false;
    } catch (error) {
      console.error("Form validation failed:", error);

      // Error message
      message.error("Failed to create Learning Progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      footer={null}
      visible={snap.CreateLearningProgressModalOpened}
      onCancel={() => {
        state.CreateLearningProgressModalOpened = false;
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="planName"
          label="Title"
          rules={[{ required: true, message: "Update title" }]}
        >
          <Input placeholder="Give a brief title for your progress update" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea placeholder="Describe your recent learning progress" />
        </Form.Item>
        <Form.Item
          name="goal"
          label="Tutorials"
          rules={[{ required: true, message: "Please enter tutorials" }]}
        >
          <Input placeholder="skills you learned from this update" />
        </Form.Item>
        <Form.Item
          name="routines"
          label="New skills learned"
          rules={[{ required: true, message: "Please enter Skills" }]}
        >
          <Input.TextArea placeholder="Skills you have acquired" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Share Progress
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateLearningProgressModal;
