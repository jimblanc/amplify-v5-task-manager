import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

type TaskMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerTask = {
  readonly id: string;
  readonly description?: string | null;
  readonly complete?: boolean | null;
  readonly dueDate?: string | null;
  readonly title?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTask = {
  readonly id: string;
  readonly description?: string | null;
  readonly complete?: boolean | null;
  readonly dueDate?: string | null;
  readonly title?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Task = LazyLoading extends LazyLoadingDisabled ? EagerTask : LazyTask

export declare const Task: (new (init: ModelInit<Task, TaskMetaData>) => Task) & {
  copyOf(source: Task, mutator: (draft: MutableModel<Task, TaskMetaData>) => MutableModel<Task, TaskMetaData> | void): Task;
}