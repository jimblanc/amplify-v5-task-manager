// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Comment, Task } = initSchema(schema);

export {
  Comment,
  Task
};