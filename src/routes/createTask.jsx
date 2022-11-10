import { useNavigate } from 'react-router-dom'
import { Text, View, Heading } from '@aws-amplify/ui-react';
import { navigateHome } from '../utils';
import { NewTaskForm } from '../ui-components';

function CreateTask() {
  const navigate = useNavigate();

  return (
    <View className="App">
      <Heading level={3}>Amplified Task Planner</Heading>
      <Text marginBottom={"medium"} marginTop={"large"}>Use the form below to create a new task.</Text>

      <NewTaskForm 
        onSuccess={() => navigateHome(navigate)}
        onCancel={() => navigateHome(navigate)}
      />
    </View>
  );
}

export default CreateTask;