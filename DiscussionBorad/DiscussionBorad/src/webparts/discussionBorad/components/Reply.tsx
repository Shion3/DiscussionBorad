import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import DiscussionService from './DiscussionService';
import * as $ from 'jquery';

export interface IReplyProps {
    service: DiscussionService;
    parentMsg: any;
    folderPath: string;
}
export interface IReplyState {
    editing: boolean;
}

export default class ReplayBlock extends React.Component<IReplyProps, IReplyState> {

    private servcice: DiscussionService;

    constructor(props: IReplyProps) {
        super(props);
        this.servcice = this.props.service;
        this.state = { editing: false };
    }

    public render(): React.ReactElement<IReplyProps> {
        return (
            <div>
                {this.state.editing ?
                    <div>
                        <textarea className='replayText' />
                        <div onClick={this.replay.bind(this)}>replay</div>
                        <span className='warning' style={{ display: 'none' }}>replay content cant be empty</span>
                    </div> :
                    <div onClick={() => { this.setState({ editing: true }); }}>replay</div>}
            </div>
        )
    }
    private replay() {
        let replyContent = $($('.replayText'))[0].value;
        if (!replyContent) {
            $('.warning').show();
        }
        this.servcice.AddReply(this.props.parentMsg.Id, replyContent);
        this.setState({ editing: false });
    }
}