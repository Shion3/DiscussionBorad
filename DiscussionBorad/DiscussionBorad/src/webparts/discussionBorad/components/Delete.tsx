import * as React from 'react';
import DiscussionService from './DiscussionService';

export interface IDeleteProps {
    service: DiscussionService;
    Id: any;
    reLoad: () => void;
}

export default class DeleteBlock extends React.Component<IDeleteProps> {

    private servcice: DiscussionService;

    constructor(props: IDeleteProps) {
        super(props);
        this.servcice = this.props.service;
        this.state = { editing: false };
    }

    public render(): React.ReactElement<IDeleteProps> {
        return (
            <div onClick={() => this.DeleteMesage()} >Delete</div>
        );
    }
    private DeleteMesage(): any {
        this.servcice.DeleteMessage(this.props.Id).then((result) => {
            this.props.reLoad();
        });
    }
}