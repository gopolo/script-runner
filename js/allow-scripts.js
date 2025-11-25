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
      var customScript = this.model.get('_customScript');

      if (enableScript && customScript) {
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
