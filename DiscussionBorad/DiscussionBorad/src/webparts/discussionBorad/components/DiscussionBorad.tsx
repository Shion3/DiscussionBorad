import * as React from 'react';
import styles from './DiscussionBorad.module.scss';
import { IDiscussionBoradProps, IDiscussionBoradState } from './IDiscussionBoradProps';
import { escape } from '@microsoft/sp-lodash-subset';
import DiscussionService from './DiscussionService';
import LikeBlock from './Like';
import Replay from './Reply'
import Edit from './Edit';
import DeleteBlock from './Delete';

// const discussionId = 1;

export default class DiscussionBorad extends React.Component<IDiscussionBoradProps, IDiscussionBoradState> {

  private servcice: DiscussionService;
  private discussionId: string;
  constructor(props: IDiscussionBoradProps) {
    super(props);
    this.servcice = new DiscussionService(this.props.context, this.props.listTitle);
    this.state = { discussion: undefined, messages: [], userId: null };
  }
  public componentWillMount() {
    //discussion id!!!!!!!!
    this.servcice.RetriveSpecificDiscussion(this.props.discussionId).then((discussion) => {
      this.servcice.RetriveMessages(discussion.Title).then((messages) => {
        return this.servcice.MessageAddChildren(discussion.Id, messages)
      }).then((message) => {
        this.servcice.CheckUserIsInLikeString().then((userID) => {
          this.setState({ discussion: discussion, messages: message, userId: userID });
        })
      })
    })
  }
  protected createMessage() {
    let messageBlock = null;
    let messageCount = 0;
    messageBlock = this.state.messages.map((message, index) => {
      if (index == 0) return;
      if (!message.ACSDeleted) { messageCount++ };
      var html = { __html: message.ACSDeleted ? "Message has been deleted." : message.Body };
      let likeBlock = <LikeBlock userId={this.state.userId} messageId={message.Id} service={this.servcice} likeString={message.LikedByStringId} ></LikeBlock>
      let deleteBlock = <DeleteBlock service={this.servcice} Id={message.Id} reLoad={this.reLoad.bind(this)} />
      return <div key={"message" + index} className={styles.row}>
        <span className={styles.title}>AuthorID: {message.AuthorId}</span>
        <p dangerouslySetInnerHTML={html} className={styles.subTitle}></p>
        {message.ACSDeleted ? "" : likeBlock}
        {message.ACSDeleted ? "" : <Replay service={this.servcice} Id={message.Id} reLoad={this.reLoad.bind(this)} />}
        {message.ACSDeleted ? "" : <Edit service={this.servcice} Id={message.Id} reLoad={this.reLoad.bind(this)} replyStr={message.Body}>edit</Edit>}
        {message.ACSDeleted ? "" : deleteBlock}
      </div>
    })
    return { html: messageBlock, messageCount: messageCount };
  }
  protected createDiscussion(messageCount?: number) {
    var html = { __html: this.state.discussion.Body };
    let likeBlock = <LikeBlock userId={this.state.userId} messageId={this.state.discussion.Id} service={this.servcice} likeString={this.state.discussion.LikedByStringId} ></LikeBlock>
    return <div className={styles.row}>
      <span className={styles.title}>AuthorID: {this.state.discussion.AuthorId}</span>
      <p className={styles.subTitle}>{messageCount} replies.</p>
      <p dangerouslySetInnerHTML={html} className={styles.description}></p>
      {likeBlock}
      <Replay service={this.servcice} Id={this.state.discussion.Id} reLoad={this.reLoad.bind(this)} />
    </div>
  }

  private reLoad() {
    this.servcice.RetriveMessages(this.state.discussion.Title).then((messages) => {
      return this.servcice.MessageAddChildren(this.state.discussion.Id, messages);
    }).then((message) => {
      this.setState({ messages: message });
    })
  }
  public render(): React.ReactElement<IDiscussionBoradProps> {
    let messageBlock = this.state.messages ? this.createMessage() : { html: [], messageCount: 0 };
    let discussionBlock = this.state.discussion ? this.createDiscussion(messageBlock.messageCount) : [];
    return (
      <div className={styles.discussionBorad}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
            </div>
            {discussionBlock}
            {messageBlock.html}
          </div>
          {/* <div style={{ width: "50px", height: "50px", backgroundColor: "green" }} onClick={() => this.servcice.RetrieveUserID()}>Commit</div> */}
        </div>
      </div>
    );
  }
}
