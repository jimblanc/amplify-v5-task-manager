import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom'
import Modal from 'react-modal';
import { Notifications, DataStore } from 'aws-amplify';
import { FaComment } from 'react-icons/fa';
import { Text, Tabs, TabItem, Loader, View, Heading, withInAppMessaging, Link, Card, Button } from '@aws-amplify/ui-react';
import { Task, Comment } from '../models';
import { 
  PostCommentForm 
} from '../ui-components';

// Comment modal styles
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
  },
};

// Define In App messaging events
const { InAppMessaging } = Notifications;

function TaskList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ modalIsOpen, setModalIsOpen ] = useState(false);
  const [ loadingComments, setLoadingComments ] = useState(false);
  const [ rawPendingTasks, setRawPendingTasks ] = useState([]);
  const [ rawCompletedTasks, setRawCompletedTasks ] = useState([]);
  const [ taskComments, setTaskComments ] = useState([]);
  const [ completedTaskCount, setCompletedTaskCount ] = useState(0);
  const [ commentFeedTask, setCommentFeedTask ] = useState();

  const loadingIndicator = <Loader size={'large'} margin={'large'} />;

  /*const refreshPendingTasks = async () => {
    const refreshedPendingTasks = await DataStore.query(Task, task => task.complete.eq(null)); 
    console.log('+ pending refresh', refreshedPendingTasks);
    return refreshedPendingTasks;
  };

  const refreshCompletedTasks = async () => {
    const refreshedCompletedTasks = await DataStore.query(Task, task => task.complete.eq(true)); 
    return refreshedCompletedTasks;
  };*/

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
        //console.log('+ completed snapshot', snapshot);
        setRawCompletedTasks(snapshot.items);

        /*refreshCompletedTasks().then((refreshedCompletedTasks) => {
          setRawCompletedTasks(refreshedCompletedTasks);
        });*/
      });
  };

  const openCommentModal = (task) => {
    setCommentFeedTask(task);
  };

  const loadCommentFeed = (task) => {
    const loadComments = async () => {
      setLoadingComments(true);
      
      // Make it easier to see
      await new Promise(r => setTimeout(r, 1000));

      const comments = await task.Comments.toArray();

      const renderedComments = comments.map((comment) => {
        return (<Card key={comment.id} variation={'outlined'} marginBottom="small" className='task-comment'>
          <Text>{comment.message}</Text>

          <Text color="GrayText" fontSize={"small"}>
            Posted on {moment(comment.createdAt).format('MM/DD/YYYY HH:mm')}
          </Text>
        </Card>);
      });

      setTaskComments(renderedComments);
      setLoadingComments(false);
    };

    loadComments();
  };

  const completeTask = async (task) => {
    await DataStore.save(
      Task.copyOf(task, updated => {
        updated.complete = true;
      })
    );

    const newCompletedTaskCount = completedTaskCount+1;
    setCompletedTaskCount(newCompletedTaskCount);

    // Log metric
    InAppMessaging.dispatchEvent({ name: 'complete_task', metrics: { "task_count": newCompletedTaskCount }});
  };

  // Populate initial task lists
  useEffect(() => {
    setupTaskSubscriptions();
  }, [location.key]);

  // Initial in-app notification message sync
  useEffect(() => {
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
          onClick={() => {
            InAppMessaging.dispatchEvent({ name: 'premium_action', attributes: { "isPremium": "false" }});
          }}
        >Set a Reminder</Button>
        <Button marginTop="small" size="small" marginLeft="small" onClick={() => openCommentModal(task)}>
          <Text marginLeft={5}>View Comments</Text>
        </Button>
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

      <Button
        size={"small"}
        variation={"menu"}
        onClick={() => navigate('/create-task')}
      >
        Create a New Task
      </Button>

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

      <Modal
        isOpen={modalIsOpen}
        style={modalStyles}
        onAfterOpen={() => loadCommentFeed(commentFeedTask)}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Comment Feed"
        ariaHideApp={false}
      >
        <Heading level={5} marginBottom="small">
          Task Comments
        </Heading>

        {taskComments}

        { (!loadingComments && taskComments.length <= 0) && 
          <Text className="statusText">No one has posted a comment yet.</Text>
        }

        { loadingComments && loadingIndicator }

        <PostCommentForm
          task={commentFeedTask}
          className={'comment-form'}
          onSubmit={(fields) => {
            fields.taskID = commentFeedTask.id;
            return fields;
          }}
          onSuccess={() => setModalIsOpen(false)}
          onCancel={() => setModalIsOpen(false)}
        />
      </Modal>
    </View>
  );
}

export default withInAppMessaging(TaskList);