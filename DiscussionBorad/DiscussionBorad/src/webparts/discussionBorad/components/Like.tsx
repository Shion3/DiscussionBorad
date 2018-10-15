import * as React from 'react';
import { ILikeProps, ILikeState } from './ILikeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import DiscussionService from './DiscussionService';

const discussionId = 4;

export default class DiscussionBorad extends React.Component<ILikeProps, ILikeState> {

  private servcice: DiscussionService;

  constructor(props: ILikeProps) {
    super(props);
    // this.servcice = new DiscussionService(this.props.context);
    // this.state = { discussion: undefined, messages: [] };
  }
}