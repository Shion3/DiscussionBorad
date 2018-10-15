import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'DiscussionBoradWebPartStrings';
import DiscussionBorad from './components/DiscussionBorad';
import { IDiscussionBoradProps } from './components/IDiscussionBoradProps';
import { Web } from '../../../node_modules/sp-pnp-js/lib/pnp';


export interface IDiscussionBoradWebPartProps {
  description: string;
  listTitle: string;
  discussionId: string;
}

export default class DiscussionBoradWebPart extends BaseClientSideWebPart<IDiscussionBoradWebPartProps> {
  private listTitle = "testDiscussion";
  public render(): void {
    const element: React.ReactElement<IDiscussionBoradProps> = React.createElement(
      DiscussionBorad,
      {
        description: this.properties.description,
        listTitle: this.properties.listTitle,
        discussionId: parseInt(this.properties.discussionId),
        context: this.context
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listTitle', {
                  label: strings.ListTitleFieldLabel
                }),
                PropertyPaneTextField('discussionId', {
                  label: strings.DiscussionIDFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
