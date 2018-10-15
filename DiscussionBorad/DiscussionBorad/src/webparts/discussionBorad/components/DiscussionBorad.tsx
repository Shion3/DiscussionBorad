import * as React from 'react';
import styles from './DiscussionBorad.module.scss';
import { IDiscussionBoradProps, IDiscussionBoradState } from './IDiscussionBoradProps';
import { escape } from '@microsoft/sp-lodash-subset';
import DiscussionService from './DiscussionService';

// const discussionId = 1;

export default class DiscussionBorad extends React.Component<IDiscussionBoradProps, IDiscussionBoradState> {

  private servcice: DiscussionService;
  private discussionId: string;
  constructor(props: IDiscussionBoradProps) {
    super(props);
    this.servcice = new DiscussionService(this.props.context, this.props.listTitle);
    this.state = { discussion: undefined, messages: [] };
  }
  public componentWillMount() {
    //discussion id!!!!!!!!
    this.servcice.RetriveSpecificDiscussion(this.props.discussionId).then((discussion) => {
      this.servcice.RetriveMessages(discussion.Title).then((message) => {
        this.setState({ discussion: discussion, messages: message });
      })
    })
  }
  protected createMessage() {
    let messageBlock = null;
    messageBlock = this.state.messages.map((message, index) => {
      var html = { __html: message.Body };
      return <div key={"message" + index} className={styles.row}>
        <span className={styles.title}>AuthorID: {message.AuthorId}</span>
        <p dangerouslySetInnerHTML={html} className={styles.subTitle}></p>
        <p className={styles.description}>{message.LikesCount ? message.LikesCount : 0} Likes</p>
      </div>
    })
    return messageBlock;
  }
  protected createDiscussion() {
    var html = { __html: this.state.discussion.Body };
    return <div className={styles.row}>
      <span className={styles.title}>AuthorID: {this.state.discussion.AuthorId}</span>
      <p className={styles.subTitle}>{this.state.discussion.Folder.ItemCount} replies.</p>
      <p dangerouslySetInnerHTML={html} className={styles.description}></p>
      <p className={styles.description}>{this.state.discussion.LikesCount ? this.state.discussion.LikesCount : 0} Likes</p>
    </div>
  }


  public render(): React.ReactElement<IDiscussionBoradProps> {
    let messageBlock = this.state.messages ? this.createMessage() : [];
    let discussionBlock = this.state.discussion ? this.createDiscussion() : [];
    return (
      <div className={styles.discussionBorad}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
            </div>
            {discussionBlock}
            {messageBlock}
          </div>
          {/* <div style={{ width: "50px", height: "50px", backgroundColor: "green" }} onClick={() => this.servcice.addMessage(this.props.discussion.DiscussionFolder, "aaa")}>Commit</div> */}
        </div>
      </div>
    );
  }
}
