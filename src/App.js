import { Amplify } from 'aws-amplify';
import { withAuthenticator, Text, Heading, View, Tabs, TabItem } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function App() {


  return (
    <View className="App">
      <Heading level={3}>Amplified Task Planner</Heading>
      <Text marginBottom={"large"} marginTop={"large"}>Your tasks are displayed below.</Text>
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
