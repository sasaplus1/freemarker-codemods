import * as debug from 'debug';

import type { ENodeType } from 'freemarker-parser/types/Symbols';
import type { IToken } from 'freemarker-parser/types/interface/Tokens';

const log = debug('freemarker-codemods:convert-to-ejs-tag');

export function transformer(tokens: IToken[]): IToken[] {
  return tokens.map(function (token) {
    const { endTag, startTag } = token;

    if (!endTag || !startTag) {
      return token;
    }

    log('----- convert-to-ejs-tag -----');

    let newToken: IToken = {
      ...token,
      endTag: '%>',
      startTag: '<%'
    };

    const { end, isClose, params, start, text, type } = token;

    // <#comment>comment</#comment> => <%#comment%>
    if (type === 'Directive' && /^comment$/i.test(text)) {
      newToken = {
        type: 'Text' as ENodeType,
        text: isClose ? '%>' : '<%#',
        isClose: false,
        start,
        end
      };
    }

    // <#-- comment --> => <%# comment %>
    if (type === 'Comment') {
      newToken.startTag = '<%#';
    }

    // <#include "/path/to/file" /> => <%- include "/path/to/file" %>
    if (type === 'Directive' && /^include$/i.test(text)) {
      newToken.startTag = '<%-';
    }

    // if directive
    if (type === 'Directive' && /^if$/i.test(text)) {
      if (isClose) {
        // <#/if> => <%}%>
        newToken.text = '}';
      } else {
        // <#if condition> => <%if (condition){%>
        newToken.params = `(${params}){`;
      }
    }

    // else and elseif directive
    if (type === 'Directive' && /^else(?:if)?$/i.test(text)) {
      if (params) {
        // elseif maybe
        // <#elseif condition> => <%}else if (condition){%>
        newToken.text = `}else if`;
        newToken.params = `(${params}){`;
      } else {
        // else
        // <#else> => <%}else{%>
        newToken.text = `}${text}{`;
      }
    }

    log('token: %O', token);
    log('newToken: %O', newToken);

    return newToken;
  });
}
