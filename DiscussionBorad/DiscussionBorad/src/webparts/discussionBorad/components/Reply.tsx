import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import DiscussionService from './DiscussionService';
import * as $ from 'jquery';

export interface IReplyProps {
    service: DiscussionService;
    Id: any;
    reLoad: () => void;
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
                        <textarea className={'replayText' + this.props.Id} />
                        <div onClick={this.replay.bind(this)}>replay</div>
                        <span className='warning' style={{ display: 'none' }}>replay content cant be empty</span>
                    </div> :
                    <div onClick={() => { this.setState({ editing: true }); }}>replay</div>}
            </div>
        );
    }
    private replay() {
        let replyContent = $($('.replayText' + this.props.Id))[0].value;
        if (!replyContent) {
            $('.warning').show();
        }
        this.servcice.AddReply(this.props.Id, replyContent).then((result) => {
            if (result == 'success') {
                this.props.reLoad();
            }
        });
        this.setState({ editing: false });
    }
}