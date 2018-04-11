import SourceText from "./sourceText/index";

import KeywordHistory from "./keywordhistory/index";
import Jieba from "./jieba/index";

import totalkeyword from "./totalkeyword/index";

import pdf2txt from "./pdf2text/index";

export default app => {
  [SourceText, KeywordHistory, Jieba, totalkeyword, pdf2txt].forEach(router => {
    router(app);
  });
};
