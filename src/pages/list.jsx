import { useState, useEffect } from 'react';
import moment from 'moment';
import { Notifications, DataStore } from 'aws-amplify';
import { Text, Tabs, TabItem, View, Heading, withInAppMessaging, Card, Button, Expander, ExpanderItem } from '@aws-amplify/ui-react';
import { Task } from '../models';
import { CreateTaskForm } from '../ui-components';

// Define In App messaging events
const { InAppMessaging } = Notifications;

function TaskList() {
  const [ rawPendingTasks, setRawPendingTasks ] = useState([]);
  const [ rawCompletedTasks, setRawCompletedTasks ] = useState([]);
  const [ completedTaskCount, setCompletedTaskCount ] = useState(0);

  /**
   * Setup DataStore subscriptions for our pending & completed tasks.
   */
  const setupTaskSubscriptions = () => {
    DataStore.observeQuery(Task, task => task.complete.eq(null))
      .subscribe(snapshot => {
        console.log('+ pending snapshot', snapshot);
        setRawPendingTasks(snapshot.items);

        /*refreshPendingTasks().then((refreshedPendingTasks) => {
          setRawPendingTasks(refreshedPendingTasks);
        });*/
      });

      DataStore.observeQuery(Task, task => task.complete.eq(true))
      .subscribe(snapshot => {
        //console.log('+ pending snapshot', snapshot);
        setRawCompletedTasks(snapshot.items);

        /*refreshPendingTasks().then((refreshedPendingTasks) => {
          setRawCompletedTasks(refreshedPendingTasks);
        });*/
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

  // Build pending tasks
  const renderedPendingTasks = rawPendingTasks.map(task => {
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
          onClick={accessPremiumFeature}
        >Set a Reminder</Button>
      </Card>
    </View>
  });

  // Build completed tasks
  const renderedCompletedTasks = rawCompletedTasks.map(task => {
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

  return (
    <View className="App">
      <Heading level={3}>Amplified Task Planner</Heading>
      <Text marginBottom={"medium"} marginTop={"large"}>Your tasks are displayed below.</Text>

      <Expander isCollapsible>
        <ExpanderItem title="Create a new task" value="create-task">
          <CreateTaskForm
            onSuccess={() => {
              console.log('+ Successfully created new task.')
            }}
          />
        </ExpanderItem>
      </Expander>

      <Tabs>
        <TabItem title="Pending">
          { renderedPendingTasks.length <= 0 && 
            <Text marginTop="large" className="statusText">You don't have any pending tasks, well done!</Text>
          }

          {renderedPendingTasks}
        </TabItem>
        <TabItem title="Completed">
          { renderedCompletedTasks.length <= 0 && 
            <Text marginTop="large" className="statusText">You haven't completed any tasks yet, get to work!</Text>
          }

          {renderedCompletedTasks}
        </TabItem>
      </Tabs>
    </View>
  );
}

export default withInAppMessaging(TaskList);