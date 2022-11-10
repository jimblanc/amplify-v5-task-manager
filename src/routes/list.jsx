import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom'
import { Notifications, DataStore } from 'aws-amplify';
import { Text, Tabs, TabItem, Loader, View, Heading, withInAppMessaging, Link, Card, Button } from '@aws-amplify/ui-react';
import { Task } from '../models';

// Define In App messaging events
const { InAppMessaging } = Notifications;

function TaskList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ loadingTasks, setLoadingTasks ] = useState(false);
  const [ pendingTasks, setPendingTasks ] = useState([]);
  const [ completedTasks, setCompletedTasks ] = useState([]);
  const [ completedTaskCount, setCompletedTaskCount ] = useState(0);

  const loadingIndicator = <Loader size={'large'} margin={'large'} />;

  const completeTask = async (task) => {
    await DataStore.save(
      Task.copyOf(task, updated => {
        updated.complete = true;
      })
    );

    const newCompletedTaskCount = completedTaskCount+1;

    setCompletedTaskCount(newCompletedTaskCount);

    // Log metric
    InAppMessaging.dispatchEvent({ name: 'complete_task', metrics: { "task_count": newCompletedTaskCount + 3 }});

    // Reload task lists
    loadTasks();
  };

  const loadTasks = async () => {
    setLoadingTasks(true);

    const pendingTasks = await DataStore.query(Task, task => task.complete.eq(null));
    const completedTasks = await DataStore.query(Task, task => task.complete.eq(true));

    const renderedPendingTasks = pendingTasks.map(task => {
      return <View key={task.id}>
        <Card variation={'elevated'} marginTop="small">
          <Heading level={5} marginBottom="small">
            {task.title}
          </Heading>
          <Text marginBottom="small">
            {task.description}
          </Text>
          <Text color="GrayText" fontSize={"small"}>
            Due by: {moment(task.dueDate).format('MM/DD/YYYY HH:mm')}
          </Text>
          <Button variation={"primary"} marginTop="small" size="small"
            onClick={() => completeTask(task)}
          >Complete Task</Button>
          <Button marginTop="small" size="small" marginLeft="small"
            onClick={() => {
              InAppMessaging.dispatchEvent({ name: 'premium_action', attributes: { "isPremium": "false" }});
            }}
          >Set a Reminder</Button>
        </Card>
      </View>
    });

    const renderedCompletedTasks = completedTasks.map(task => {
      return <View key={task.id}>
        <Card variation={'elevated'} marginTop="small">
          <Heading level={5} marginBottom="small">
            {task.title}
          </Heading>
          <Text marginBottom="small">
            {task.description}
          </Text>
          <Text color="GrayText" fontSize={"small"}>
            Originally due by: {moment(task.dueDate).format('MM/DD/YYYY HH:mm')}
          </Text>
        </Card>
      </View>
    });

    setLoadingTasks(false);
    setPendingTasks(renderedPendingTasks);
    setCompletedTasks(renderedCompletedTasks);
  };

  // Populate initial task lists
  useEffect(() => {
    loadTasks();
  }, [location.key, completedTaskCount]);

  // Initial in-app notification message sync
  useEffect(() => {
    InAppMessaging.syncMessages();
  }, []);

  return (
    <View className="App">
      <Heading level={3}>Amplified Task Planner</Heading>
      <Text marginBottom={"medium"} marginTop={"large"}>Your tasks are displayed below.</Text>

      <Button
        size={"small"}
        variation={"menu"}
        onClick={() => navigate('/create-task')}
      >
        Create a New Task
      </Button>

      <Tabs>
        <TabItem title="Pending">
          { loadingTasks && loadingIndicator }

          { (!loadingTasks && pendingTasks.length <= 0) && 
            <Text marginTop="large" className="statusText">You don't have any pending tasks, well done!</Text>
          }

          {pendingTasks}
        </TabItem>
        <TabItem title="Completed">
          { loadingTasks && loadingIndicator }

          { (!loadingTasks && completedTasks.length <= 0) && 
            <Text marginTop="large" className="statusText">You haven't completed any tasks yet, get to work!</Text>
          }

          {completedTasks}
        </TabItem>
      </Tabs>
    </View>
  );
}

export default withInAppMessaging(TaskList);