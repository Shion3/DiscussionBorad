import { Web } from "sp-pnp-js";
import { IWebPartContext } from '@microsoft/sp-webpart-base';

export interface IDiscussionBoradProps {
  description: string;
  listTitle: string;
  context: IWebPartContext;
  discussionId:number;
}
export interface IDiscussionBoradState {
  discussion: any;
  messages: Array<any>;
}
// export interface IDiscussion {
//   DiscussionId: number;
//   DiscussionTitle: string;
//   DiscussionBody: string;
//   DiscussionAuthor: number;
//   DiscussionLike: number;
//   DiscussionLikeStringId: string[];
//   DiscussionFolder: string;
//   MessagesCount: number;
//   Messages: IMessage[];
// }
// export interface IMessage {
//   MessageAuthor: number;
//   MessageBody: string;
//   MessageID: number;
//   MessageLikedByStringId: string[];
//   MessageLikesCount: number;
//   MessageParentID: number;
// }
