import * as React from 'react';
import { ILikeProps, ILikeState } from './ILikeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import DiscussionService from './DiscussionService';

const discussionId = 4;

export default class LikeBlock extends React.Component<ILikeProps, ILikeState> {

  private servcice: DiscussionService;

  constructor(props: ILikeProps) {
    super(props);
    this.servcice = this.props.service;
    this.state = { isCurrentLike: false };
  }

  public componentWillMount() {
    if (this.props.likeString) {
      this.servcice.CheckUserIsInLikeString(this.props.likeString).then((result) => {
        this.setState({ isCurrentLike: result });
      })
    }
  }

  public render(): React.ReactElement<ILikeProps> {
    return (
      <div>{this.state.isCurrentLike ? "aaaaaa" : "bbbbbbbbbbbb"}</div>
    )
  }
}