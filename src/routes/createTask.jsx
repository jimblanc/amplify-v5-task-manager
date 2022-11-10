import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Text, View, Heading } from '@aws-amplify/ui-react';
import CreateTaskForm from '../ui-components/CreateTaskForm';

function CreateTask() {
  const navigate = useNavigate();
  const navigateHome = () => navigate('/');

  return (
    <View className="App">
      <Heading level={3}>Amplified Task Planner</Heading>
      <Text marginBottom={"medium"} marginTop={"large"}>Use the form below to create a new task.</Text>

      <CreateTaskForm 
        onSuccess={() => {
          navigateHome()
        }}
        onCancel={() => {
          navigateHome()
        }}
      />
    </View>
  );
}

export default CreateTask;