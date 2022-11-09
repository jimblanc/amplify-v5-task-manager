import { useState, useEffect } from 'react';
import { Amplify, Notifications, DataStore } from 'aws-amplify';
import { withAuthenticator, withInAppMessaging, Text, Heading, View, Tabs, TabItem } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import { Task } from './models';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

Amplify.configure(awsExports);

// Define In App messaging events
const { InAppMessaging } = Notifications;

function App() {
  const [ loadingTasks, setLoadingTasks ] = useState(false);
  const [ pendingTasks, setPendingTasks ] = useState();
  const [ completedTasks, setCompletedTasks ] = useState();

  // Populate initial task lists
  useEffect(() => {
    const fetchTasks = async () => {
      const pendingTasksRaw = await DataStore.query(Task);
      //const completedTasksRaw = await DataStore.query(Task, task => task.complete.eq(false));

      //console.log('+ pendingTasks', pendingTasksRaw);
      //console.log('+ completedTasks', completedTasksRaw);
    };
    
    fetchTasks().catch(console.error);
  });

  // Initial in-app notification message sync
  useEffect(() => {
    InAppMessaging.syncMessages();
  }, []);

  return (
    <View className="App">
      <Heading level={3}>Amplified Task Planner</Heading>
      <Text marginBottom={"medium"} marginTop={"large"}>Your tasks are displayed below.</Text>
      <Tabs>
        <TabItem title="Pending">

        </TabItem>
        <TabItem title="Completed">

        </TabItem>
      </Tabs>
    </View>
  );
}

export default withAuthenticator(App);
