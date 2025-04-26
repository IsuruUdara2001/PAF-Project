import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Space, Typography, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningProgressService from "../../Services/LearningProgressService";

const { TextArea } = Input;
const { Title } = Typography;

const EditLearningProgressModal = () => {
  const snap = useSnapshot(state);
  const selectedPlan = snap.selectedWorkoutPlan;
  const [updateLoading, setUpdateLoading] = useState(false);
  const [form] = Form.useForm();

  // Reset form fields when selected plan changes
  useEffect(() => {
    if (selectedPlan && form) {
      form.setFieldsValue({
        planName: selectedPlan.planName,
        description: selectedPlan.description,
        routines: selectedPlan.routines,
        goal: selectedPlan.goal,
      });
    }
  }, [selectedPlan, form]);

  const updateWorkoutPlan = async (values) => {
    try {
      setUpdateLoading(true);
      // Prepare data for update
      const body = { 
        ...values, 
        userId: snap.currentUser?.uid,
        lastUpdated: new Date().toISOString().split('T')[0],
        // Preserve existing values for fields we're not updating
        category: selectedPlan.category,
        completedItems: selectedPlan.completedItems,
        totalItems: selectedPlan.totalItems
      };
      
      await LearningProgressService.updateWorkoutPlan(selectedPlan.id, body);
      
      // Update the state without page refresh
      const updatedPlans = await LearningProgressService.getAllWorkoutPlans();
      state.workoutPlans = updatedPlans;
      
      // Update the selected plan in state with new values
      const updatedPlan = updatedPlans.find(plan => plan.id === selectedPlan.id);
      if (updatedPlan) {
        state.selectedWorkoutPlan = updatedPlan;
      }
      
      // Close the modal
      state.editWorkoutPlanOpened = false;
      
      // Success message
      message.success("Learning Progress updated successfully!");
    } catch (error) {
      console.error("Failed to update Learning Progress:", error);
      
      // Error message
      message.error("Failed to update Learning Progress. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={4}>Edit Learning Plan</Title>}
      open={snap.editWorkoutPlanOpened}
      onCancel={() => {
        state.editWorkoutPlanOpened = false;
        form.resetFields();
      }}
      footer={null}
      destroyOnClose={true}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={updateWorkoutPlan}
        initialValues={{
          planName: selectedPlan?.planName || "",
          description: selectedPlan?.description || "",
          routines: selectedPlan?.routines || "",
          goal: selectedPlan?.goal || "",
        }}
      >
        <Form.Item
          name="planName"
          label="Plan Name"
          rules={[{ required: true, message: "Please enter a plan name" }]}
        >
          <Input placeholder="Enter plan name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea 
            placeholder="Describe your learning plan" 
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          name="routines"
          label="Skills to Learn (comma separated)"
        >
          <Input placeholder="e.g. React, JavaScript, UI Design" />
        </Form.Item>

        <Form.Item
          name="goal"
          label="Tutorials & Resources"
        >
          <TextArea 
            placeholder="List tutorials or resources for this plan" 
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 16 }}>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={updateLoading}
            >
              Update Plan
            </Button>
            <Button onClick={() => {
              state.editWorkoutPlanOpened = false;
              form.resetFields();
            }}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditLearningProgressModal;
