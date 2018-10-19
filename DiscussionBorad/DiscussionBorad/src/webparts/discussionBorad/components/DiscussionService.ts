import { IWebPartContext } from '@microsoft/sp-webpart-base';
import * as $ from 'jquery';
import {
    SPHttpClient,
    SPHttpClientResponse
} from '@microsoft/sp-http';
import { Web } from '../../../../node_modules/sp-pnp-js/lib/pnp';
import pnp, { Item } from 'sp-pnp-js';
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');

export default class DiscussionService {
    private _webPartContext: IWebPartContext;
    private ListTitle: string;

    constructor(value: IWebPartContext, listTitle: string) {
        this._webPartContext = value;
        this.ListTitle = listTitle;
    }

    private Post(url, postData, resolve, reject) {
        let fetchProps: RequestInit = {
            method: "POST",
            mode: "cors",
            headers: {
                "Accept": "application/json;odata=verbose",
                "cookie": document.cookie,
                "IF-MATCH": "*",
                "content-type": "application/json;odata=verbose",
                "X-Http-Method": "MERGE"
            },
            credentials: "include"
        };
        return fetch(this._webPartContext.pageContext.web.absoluteUrl + "/_api/contextinfo", fetchProps)
            .then((response: any) => response.json()).then((responseJson: any) => {
                let digest = responseJson.d.GetContextWebInformation.FormDigestValue as string;
                let requestHeaders = {
                    "Accept": "application/json; odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": digest,
                    "X-HTTP-Method": "MERGE",
                    "If-Match": "*",
                };
                $.ajax({
                    url: url,
                    method: "POST",
                    contentType: "application/json;odata=verbose;charset=utf-8",
                    headers: requestHeaders,
                    data: JSON.stringify(postData),
                    success: resolve,
                    error: reject
                });
            });
    }
    public RetriveDiscussion(): Promise<any> {
        const url = `${this._webPartContext.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${this.ListTitle}')/items?$expand=FieldValuesAsText,Folder/ItemCount`;
        return this._webPartContext.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json().then(responseJSON => {
                    return responseJSON;
                });
            });
    }
    public RetriveSpecificDiscussion(id: number): Promise<any> {
        const expandFileds = ["FieldValuesAsText", "Folder"];
        return pnp.sp.web.lists.getByTitle(this.ListTitle).items.getById(id).expand(...expandFileds).get().then((Discussion) => {
            return Discussion;
        });
    }
    public RetriveMessages(discussionTitle: string): Promise<any> {
        const selectField = ["Body", "AuthorId", "FileDirRef", "LikedByStringId", "LikesCount", "ParentItemID", "ID", "ACSDeleted","FieldValuesAsText"];
        let filterStr = `FileDirRef eq '${this._webPartContext.pageContext.web.serverRelativeUrl}/Lists/${this.ListTitle}/${discussionTitle}'`;
        return pnp.sp.web.lists.getByTitle(this.ListTitle).items.select(...selectField).expand("FieldValuesAsText").filter(filterStr).get().then((Messages) => {
            return Messages;
        });
    }
    public RetriveMessageLikeString(messageId: number): Promise<any> {
        const selectField = ["FileDirRef", "LikedByStringId", "LikesCount", "ParentItemID", "ID"];
        return pnp.sp.web.lists.getByTitle(this.ListTitle).items.select(...selectField).expand('FieldValuesAsText').getById(messageId).get().then((Messages) => {
            return Messages;
        });
    }
    public CheckUserIsInLikeString(): Promise<any> {
        return pnp.sp.web.currentUser.get().then((user) => {
            return user.Id;
        });
    }
    private executeJson(options) {
        var headers = options.headers || {};
        headers["Accept"] = "application/json;odata=verbose";

        var ajaxOptions =
            {
                url: options.url,
                type: options.method,
                contentType: "application/json;odata=verbose",
                headers: headers,
                data: ""
            };
        if (options.method == "POST") {
            ajaxOptions.data = JSON.stringify(options.payload);
        }

        return $.ajax(ajaxOptions);
    }
    private getListItem(webUrl, listTitle, itemId) {
        var options = {
            url: webUrl + "/_api/web/lists/getbytitle('" + listTitle + "')/items(" + itemId + ")",
            method: "GET"
        };
        return this.executeJson(options);
    }
    private updateListItem(listTitle, itemId, itemPayload) {
        let fetchProps: RequestInit = {
            method: "POST",
            mode: "cors",
            headers: {
                "Accept": "application/json;odata=verbose",
                "cookie": document.cookie,
                "IF-MATCH": "*",
                "content-type": "application/json;odata=verbose",
                "X-Http-Method": "MERGE"
            },
            credentials: "include"
        };
        return fetch(this._webPartContext.pageContext.web.absoluteUrl + "/_api/contextinfo", fetchProps)
            .then((response: any) => response.json()).then((responseJson: any) => {
                let digest = responseJson.d.GetContextWebInformation.FormDigestValue as string;
                var options = {
                    url: this._webPartContext.pageContext.web.absoluteUrl + "/_api/web/lists/getbytitle('" + listTitle + "')/items(" + itemId + ")",
                    method: "POST",
                    headers: {
                        "X-HTTP-Method": "MERGE",
                        "If-Match": "*",
                        "X-RequestDigest": digest,
                    },
                    payload: itemPayload
                };
                return this.executeJson(options);
            });

    }
    public updateSpecificMessage(messageId: number, likeString: string[], userId: number, isLike: boolean): Promise<any> {
        return this.getListItem(this._webPartContext.pageContext.web.absoluteUrl, this.ListTitle, messageId).then((data) => {
            var likes = data.d.LikesCount;
            var userKeys = data.d.LikedByStringId == null ? { "results": [] } : data.d.LikedByStringId;
            var posKey = userKeys.results.indexOf(userId.toString());
            if (posKey == -1) {
                userKeys.results.push(userId.toString());
                likes++;
            } else {
                userKeys.results.splice(posKey, 1);
                likes--;
            }
            var postData = {
                "__metadata": data.d.__metadata,
                "LikedByStringId": { "results": userKeys.results },
                LikesCount: likes
            };
            return this.updateListItem(this.ListTitle, messageId, postData);
        });
    }
    public editMessage(messageId: number, body: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            var context = SP.ClientContext.get_current();
            var item = context.get_web().get_lists().getByTitle(this.ListTitle).getItemById(messageId);
            item.set_item("Body", body);
            item.update();
            context.executeQueryAsync(() => {
                resolve('success');
            }, (b, a) => {
                reject(a.get_message());
            });
        });
    }

    public DeleteMessage(messageId: any): any {
        return new Promise<any>((resolve, reject) => {
            this.getListItem(this._webPartContext.pageContext.web.absoluteUrl, this.ListTitle, messageId).then((data) => {
                let url = this._webPartContext.pageContext.web.absoluteUrl + "/_api/web/lists/getByTitle('" + this.ListTitle + "')/items(" + messageId + ")";
                let postData = { "__metadata": data.d.__metadata, "ACSDeleted": true };
                this.Post(url, postData, resolve, reject);
            }).then(msg => {
                return msg;
            }, err => {
                return -1;
            }).catch(ex => {
                return -1;
            });
        });
    }

    public AddReply(parentId: number, body: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            var context = SP.ClientContext.get_current();
            var parentItem = context.get_web().get_lists().getByTitle(this.ListTitle).getItemById(parentId);
            var newItem = SP.Utilities.Utility.createNewDiscussionReply(context, parentItem);
            newItem.set_item("Body", body);
            newItem.update();
            context.executeQueryAsync(() => {
                resolve('success');
            }, (b, a) => {
                reject(a.get_message());
            });
        });
    }

    ///messages需要保证子节点一定在父节点之后，可以创建时间或者ID排序。
    public MessageAddChildren(discussionId: number, messages: Array<any>): Array<any> {
        messages.splice(0, 0, { children: '' });
        var messageIDs = [];
        messages.map((message, index) => {
            if (index == 0) return;
            messageIDs.push(message.ID);
            message.children = '';
            if (message.ParentItemID == discussionId) {
                messages[0].children += `,${index}`;
                return;
            }
            let parentIndex = messageIDs.indexOf(message.ParentItemID);
            if (parentIndex != -1) {
                messages[parentIndex + 1].children += `,${index}`;
            }
        });
        return messages;
    }
}