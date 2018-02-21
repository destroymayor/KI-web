import SourceText from './sourceText/index';
import KeywordHistory from './keywordhistory/index';
import jieba from './jieba/index';

export default (app) => {
  [SourceText, KeywordHistory, jieba].forEach((router) => {
    router(app);
  });
};
