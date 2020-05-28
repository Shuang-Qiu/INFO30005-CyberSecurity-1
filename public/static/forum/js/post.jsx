const CommentItem = ({ item }) => (
  <div>
    <a class="list-group-item list-group-item-action">
      <div
        class="d-flex align-items-center"
        data-toggle="tooltip"
        data-placement="right"
        data-title="2 hrs ago"
        data-original-title=""
        title=""
      >
        <div>
          <img
            alt="Image placeholder"
            src={item.icon}
            class="avatar rounded-circle"
          />
        </div>
        <div class="flex-fill ml-3">
          <div class="h6 text-sm mb-0">
            {item.userName}
            <small class="float-right text-muted">{item.createTime}</small>
          </div>
          <p class="text-sm lh-140 mb-0">{item.content}</p>
        </div>
      </div>
    </a>
  </div>
);

class App extends React.Component {
  state = {
    post: {
      title: "",
      content: "",
      _id: 1,
      comment: []
    },
  };

  componentDidMount() {
    this.getPostById();
    this.signInStatus();
  }

  toast = ({ type = "success", message = "", duration = 2000 }) => {
    let caseMap = {
      error: ({ type, message }) => (
        <div className="alert alert-danger" role="alert">
          <strong>{message}</strong>
        </div>
      ),
      success: ({ type, message }) => (
        <div className="alert alert-success" role="alert">
          <strong>{message}</strong>
        </div>
      ),
    };
    let modalToast = document.createElement('div')
    document.body.appendChild(modalToast)
    ReactDOM.render(caseMap[type]({ type, message }), modalToast);
    setTimeout(() => {
      modalToast.remove()
    }, duration);
  };

  submitComment = () => {
    const pathname = window.location.pathname;
    const id = pathname.split('/')[3];
    const content = this.state.comment_enter;

    if (!content){
      this.toast({
        type: 'error',
        message: 'Please enter something!'
      });
      return;
    }
    $.ajax({
      url: "/forum/post/" + id + "/comment",
      method: "PUT",
      data : {
        content : content
      }
    }).then((res) => {
      if (!res || res.error) {
        this.toast({
          type: 'error',
          message: 'error occurs when posting comment'
        });
        return;
      }
      this.toast({
        type: 'success',
        message: 'You have successfully entered a comment!'
      });
      window.location.reload();
    });
  };
  /**
 * @description getPostById
 */
  getPostById = () => {
    const pathname = window.location.pathname;

    const id = pathname.split('/')[3];

    $.ajax({
      url: "/forum/post/" + id,
      method: "GET",
    }).then((res) => {
      if (!res || res.error) {
        this.toast({
          type: 'error',
          message: 'Invalid post ID path'
        });
        setTimeout(() => {
          this.window.href = '/404';
        }, 800);
        return;
      }
      this.setState({ post: res });
    });
  };

  signInStatus = () => {
    $.ajax({
      url: "/user/checkcookie",
      mehtod: "GET",
    }).then((res) => {
      if (res && !res.error) {
        this.setState({
          cookie_id: res._id,
        });
        $("#navbar-main-collapse>ul.d-none>li:nth-child(1)").hide();
        $("#navbar-main-collapse>ul.d-none>li:nth-child(2)").show();
        $("#navbar-main-collapse>ul.mx-auto>li:nth-child(2)").show();
        $("#navbar-main-collapse>ul.mx-auto>li:nth-child(2)").show();
        $("#comment").show();
      } else {
        $("#navbar-main-collapse>ul.d-none>li:nth-child(1)").show();
        $("#navbar-main-collapse>ul.d-none>li:nth-child(2)").hide();
        $("#navbar-main-collapse>ul.mx-auto>li:nth-child(2)").hide();
        $("#comment").hide();
      }
    });
  };

  render() {
    return (
      <div>
        <section class="pt-5 bg-section-secondary" style={{ minHeight: 900 }}>
          <div class="container">
            <div class="card-header">
              <h3>{this.state.post.title}</h3>
            </div>
            <p>{this.state.post.content}</p>
            <div class="card-header">
              <h6>Comments</h6>
            </div>
            {this.state.post.comment.map((item, index) => (
              <React.Fragment>
                <CommentItem item={item} />
              </React.Fragment>
            ))}
          </div>
        </section>
        <section class="form-group" id="comment">
          <label class="form-control-label">Your Comment</label>
          <textarea class="form-control" placeholder="Please enter your comment" rows="3"
            onChange={(e) => {
              this.setState({ comment_enter: e.target.value });
            }} />
          <button type="button" class="btn btn-primary btn-sm" onClick={() => this.submitComment()}>
            Submit
          </button>
        </section>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"))