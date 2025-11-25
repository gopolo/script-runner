define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var AllowScriptsView = ComponentView.extend({

    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();
      this.executeCustomScript();
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },

    executeCustomScript: function() {
      var enableScript = this.model.get('_enableScript');
      var videoUrl = this.model.get('_videoUrl');
      var customScript = this.model.get('_customScript');

      // Handle video URL embedding first (simpler and more reliable)
      if (enableScript && videoUrl) {
        try {
          var container = this.$('.allow-scripts__body');
          var iframe = $('<iframe></iframe>')
            .attr('src', videoUrl)
            .attr('width', '100%')
            .attr('height', '360')
            .attr('frameborder', '0')
            .attr('allowfullscreen', true)
            .css({
              'display': 'block',
              'margin': '0 auto'
            });
          
          container.append(iframe);
          this.$('.allow-scripts__status').text('Video loaded successfully.');
        } catch (error) {
          console.error('AllowScripts: Error loading video:', error);
          this.$('.allow-scripts__status').text('Video error: ' + error.message);
        }
      } else if (enableScript && customScript) {
        try {
          // Create a new function from the custom script string
          // This provides a safer execution context than eval()
          var scriptFunction = new Function(customScript);
          scriptFunction.call(this);
          
          this.$('.allow-scripts__status').text('Custom script enabled and running.');
        } catch (error) {
          console.error('AllowScripts: Error executing custom script:', error);
          this.$('.allow-scripts__status').text('Custom script error: ' + error.message);
        }
      } else {
        this.$('.allow-scripts__status').text('Custom script disabled.');
      }
    }

  }, {
    template: 'allow-scripts'
  });

  return Adapt.register('allow-scripts', {
    model: ComponentModel.extend({}),
    view: AllowScriptsView
  });

});
