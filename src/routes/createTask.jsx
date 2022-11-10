import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Text, View, Heading } from '@aws-amplify/ui-react';
import CreateTaskForm from '../ui-components/CreateTaskForm';

function CreateTask() {
  const navigate = useNavigate();

  return (
    <View className="App">
      <Heading level={3}>Amplified Task Planner</Heading>
      <Text marginBottom={"medium"} marginTop={"large"}>Use the form below to create a new task.</Text>

      <CreateTaskForm 
        onSuccess={async () => {
          await new Promise(r => setTimeout(r, 250));
          
          navigate('/');
        }}
        onCancel={() => {
          navigate('/');
        }}
      />
    </View>
  );
}

export default CreateTask;