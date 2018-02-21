import SourceText from './sourceText/index';
import KeywordHistory from './keywordhistory/index';
import Jieba from './jieba/index';

export default (app) => {
  [SourceText, KeywordHistory, Jieba].forEach((router) => {
    router(app);
  });
};
