/**
 * @jsx React.DOM
 */

(function($) {

  var SearchBox = React.createClass({
    search: function() {
      this.props.onSearch({
        term: this.refs.term.getDOMNode().value.trim()
      });
    },
    render: function() {
      return (
        <input type="text" placeholder="Search..."
          onKeyUp={_.debounce(this.search, 250)} ref="term" />
      );
    }
  });

  var Charity = React.createClass({
    select: function() {
      this.props.onSelect({ ein: this.props.data.ein });
    },
    render: function() {
      return (
        <li onClick={this.select}>{this.props.data.charity_name}</li>
      )
    }
  });

  var CharityList = React.createClass({
    render: function() {
      var self = this;
      var nodes = _.map(this.props.data, function(charity) {
        return <Charity key={charity.ein} data={charity} onSelect={self.props.onSelect} />;
      });
      return (
        <ul>
          {nodes}
        </ul>
      )
    }
  });

  var Snippet = React.createClass({
    select: function() {
      $("#snippet").select();
    },
    render: function() {
      var tmpl = _.template($("#tmpl-snippet").html())({
        ein: this.props.ein == '' ? "362423707" : this.props.ein
      }).replace(/&lt;/g, '<').replace(/&gt;/g, '>');

      return (
        <textarea id="snippet" rows="2" readOnly onClick={this.select}>
          {tmpl}
        </textarea>
      )
    }
  })

  var CharitySelector = React.createClass({
    getInitialState: function() {
      return {
        data: [],
        selected: []
      };
    },
    componentWillMount: function() {
      $.ajax({
        url: 'http://api.charitynavigator.org/api/v1/lists-orgs/' +
          '?app_key=5d62bdf5dcbacc6efd02cd31218eaae2&app_id=d32371f1' +
          '&listid=18',
        dataType: 'jsonp',
        success: function(data) {
          this.setState({data: data.objects});
        }.bind(this)
      });
    },
    updateList: function(opts) {
      $.ajax({
        url: 'http://api.charitynavigator.org/api/v1/search/' +
          '?app_key=5d62bdf5dcbacc6efd02cd31218eaae2&app_id=d32371f1' +
          '&term=' + opts.term,
        dataType: 'jsonp',
        success: function(data) {
          var result = _.map(data.objects, function(obj) {
            return _.reduce(obj, function(acc, v, k) {
              acc[k.toLowerCase()] = v;
              return acc;
            }, {});
          });
          this.setState({data: result});
        }.bind(this)
      });
    },
    updateSnippet: function(opts) {
      this.setState({ selected: opts.ein });
    },
    render: function() {
      return (
        <div>
          <SearchBox onSearch={this.updateList} />
          <CharityList data={this.state.data} onSelect={this.updateSnippet} />
          <Snippet ein={this.state.selected} />
        </div>
      );
    }
  })

  React.renderComponent(
    <CharitySelector />,
    $(".container")[0]
  );

})(jQuery);
