import SourceText from './sourceText/index';
import KeywordHistory from './keywordhistory/index';
import Jieba from './jieba/index';

import totalkeyword from './totalkeyword/index';

export default (app) => {
  [SourceText, KeywordHistory, Jieba, totalkeyword].forEach((router) => {
    router(app);
  });
};
