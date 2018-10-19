import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import DiscussionService from './DiscussionService';
import * as $ from 'jquery';

export interface IEditProps {
    service: DiscussionService;
    Id: any;
    reLoad: () => void;
    replyStr: string;
}
export interface IEditState {
    editing: boolean;
}

export default class ReplayBlock extends React.Component<IEditProps, IEditState> {

    private servcice: DiscussionService;

    constructor(props: IEditProps) {
        super(props);
        this.servcice = this.props.service;
        this.state = { editing: false };
    }

    public render(): React.ReactElement<IEditProps> {
        return (
            <div>
                {this.state.editing ?
                    <div>
                        <textarea className={'editText' + this.props.Id}>
                            {this.props.replyStr}
                        </textarea>
                        <div onClick={() => { this.setState({ editing: false }); }}>cancel</div>
                        <div onClick={this.edit.bind(this)}>edit</div>
                        <span className='warning' style={{ display: 'none' }}>replay content cant be empty</span>
                    </div> :
                    <div onClick={() => { this.setState({ editing: true }); }}>edit</div>}
            </div>
        );
    }
    private edit() {
        let replyContent = $($('.editText' + this.props.Id))[0].value;
        if (!replyContent) {
            $('.warning').show();
        }
        this.servcice.editMessage(this.props.Id, replyContent).then((result) => {
            this.props.reLoad();
        });
        this.setState({ editing: false });
    }
}