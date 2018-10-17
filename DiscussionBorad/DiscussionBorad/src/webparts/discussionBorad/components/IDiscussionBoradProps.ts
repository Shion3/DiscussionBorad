import { Web } from "sp-pnp-js";
import { IWebPartContext } from '@microsoft/sp-webpart-base';

export interface IDiscussionBoradProps {
  description: string;
  listTitle: string;
  context: IWebPartContext;
  discussionId: number;
}
export interface IDiscussionBoradState {
  discussion: any;
  userId: number;
  messages: Array<any>;
}