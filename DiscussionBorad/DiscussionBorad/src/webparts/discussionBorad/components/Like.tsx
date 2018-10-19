import * as React from 'react';
import { ILikeProps, ILikeState } from './ILikeProps';
import styles from './DiscussionBorad.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import DiscussionService from './DiscussionService';

const discussionId = 4;

export default class LikeBlock extends React.Component<ILikeProps, ILikeState> {

  private servcice: DiscussionService;

  constructor(props: ILikeProps) {
    super(props);
    this.servcice = this.props.service;
    this.state = { isCurrentLike: false, userId: this.props.userId, likeString: this.props.likeString, reload: false };
  }

  public componentWillMount() {
    if (this.props.likeString) {
      this.servcice.RetriveMessageLikeString(this.props.messageId).then((message) => {
        this.setState({ isCurrentLike: message.LikedByStringId.indexOf(this.props.userId.toString()) != -1 });
      });
    }
  }

  public clickEvent(messageId: number, likeString: string[], userId: number, isLike: boolean) {
    this.servcice.updateSpecificMessage(messageId, likeString, userId, isLike).then((result) => {
      this.servcice.RetriveMessageLikeString(this.props.messageId).then((message) => {
        this.setState({ reload: true, likeString: message.LikedByStringId, isCurrentLike: message.LikedByStringId == null ? false : message.LikedByStringId.indexOf(userId.toString()) != -1 });
      });
    });
  }
  public createLikeBlock(isLike: boolean, likeString: string[]) {
    let likeCount = likeString ? likeString.length : 0;
    let html = <div onClick={() => this.clickEvent(this.props.messageId, this.props.likeString, this.state.userId, isLike)} >
      <p className={styles.description}>{likeCount} Likes.    {isLike ? "Unlike" : "Like"}</p>
    </div >;
    return html;
  }


  public render(): React.ReactElement<ILikeProps> {
    let likeBlock = this.createLikeBlock(this.state.isCurrentLike, this.state.likeString);
    return (
      <div>{likeBlock}</div>
    );
  }
}