import { useState, useEffect } from 'react';
import moment from 'moment';
import { Notifications, DataStore } from 'aws-amplify';
import { Text, Tabs, TabItem, View, Heading, withInAppMessaging, Card, Button, Expander, ExpanderItem } from '@aws-amplify/ui-react';
import { Task } from '../models';
import { CreateTaskForm } from '../ui-components';

const { InAppMessaging } = Notifications;

function TaskList() {
  const [ rawTasks, setRawTasks ] = useState([]);
  const [ completedTaskCount, setCompletedTaskCount ] = useState(0);

  /**
   * Setup DataStore subscriptions for our tasks.
   */
  const setupTaskSubscriptions = () => {
    DataStore.observeQuery(Task)
      .subscribe(snapshot => {
        setRawTasks(snapshot.items);
      });
  };

  /**
   * Marks the specified task as complete & saves it to the DataStore.
   */
  const completeTask = async (task) => {
    await DataStore.save(
      Task.copyOf(task, updated => {
        updated.complete = true;
      })
    );

    const newCompletedTaskCount = completedTaskCount+1;
    setCompletedTaskCount(newCompletedTaskCount);

    // Log metric indicating how many tasks have been completed in this session
    InAppMessaging.dispatchEvent({ name: 'complete_task', metrics: { "task_count": newCompletedTaskCount }});
  };

  /**
   * Trigger when the user tries to access a "premium" feature.
   */
  const accessPremiumFeature = () => {
    InAppMessaging.dispatchEvent({ name: 'premium_action', attributes: { "isPremium": "false" }});
  };

  useEffect(() => {
    setupTaskSubscriptions();

    // Initial in-app notification message sync
    InAppMessaging.syncMessages();
  }, []);

  // Build tasks
  const renderedTasks = rawTasks.map(task => {
    const taskIsComplete = task.complete;

    return <View key={task.id}>
      <Card variation={'elevated'} marginTop="small">
        <Heading level={5} marginBottom="small">
          {task.title}
        </Heading>
        <Text marginBottom="small">
          {task.description}
        </Text>
        <Text color="GrayText" fontSize={"small"}>
          { taskIsComplete ? 'Originally due by' : 'Due by' }: {moment(task.dueDate).format('MM/DD/YYYY HH:mm')}
        </Text>
        <Button variation={"primary"} marginTop="small" size="small"
          isDisabled={taskIsComplete}
          onClick={() => completeTask(task)}
        >Complete Task</Button>
        <Button marginTop="small" size="small" marginLeft="small"
          onClick={accessPremiumFeature}
        >Set a Reminder</Button>
      </Card>
    </View>
  });

  return (
    <View className="App">
      <Heading level={3}>Amplified Task Planner</Heading>
      <Text marginBottom={"medium"} marginTop={"large"}>Your tasks are displayed below.</Text>

      <Expander isCollapsible>
        <ExpanderItem title="Create a new task" value="create-task">
          <CreateTaskForm />
        </ExpanderItem>
      </Expander>

      <Heading level={4} marginTop={'medium'}>Your Tasks</Heading>

      { renderedTasks.length <= 0 && 
        <Text marginTop="large" className="statusText">You haven't created any tasks yet!</Text>
      }

      {renderedTasks}
    </View>
  );
}

export default withInAppMessaging(TaskList);