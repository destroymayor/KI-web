import axios from "axios";

import React from "react";
import "./index.css";

class Pdf2txt extends React.PureComponent {
  state = {
    pdfText: ""
  };
  handleUploadFile = event => {
    const data = new FormData();
    data.append("pdf", event.target.files[0]);
    axios.post("/pdf2txt", data).then(response => {
      this.setState({
        pdfText: response.data.output
      });
    });
  };

  render() {
    return (
      <div>
        <p>pdf to text</p>
        <input type="file" onChange={this.handleUploadFile} />
        <div dangerouslySetInnerHTML={{ __html: this.state.pdfText }} />
      </div>
    );
  }
}

export default Pdf2txt;
