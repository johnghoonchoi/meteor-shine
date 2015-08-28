var buttonDeps = new Tracker.Dependency;

var selectors = {
  uploader: '.cloudinary-uploader',
  button: '.cloudinary-uploader .btn',
  inputFile: 'input.cloudinary-fileupload',
  progressWindow: '.cloudinary-progress',
  progressBar: '.cloudinary-progress .progress-bar'
};

/**
 *
 * @type {{_buttonHTML: string, getButtonHTML: Function, setButtonHTML: Function, setEventHandler: Function, uploadImage: Function, uploadImagePreset: Function, uploadVideo: Function, uploadFile: Function}}
 */
Cloudinary = {
  _buttonHTML: '<span>upload...</span>',

  getButtonHTML: function() {
    buttonDeps.depend();
    return this._buttonHTML;
  },

  setButtonHTML: function(html) {
    this._buttonHTML = html;
    buttonDeps.changed();
  },

  setEventHandler: function(selector, showProgress, callback) {
    $(selector).on('cloudinarystart', function() {
      if (showProgress) {
        $(selectors.progressWindow).show();
      }
    }).on('cloudinarydone', function(e, data) {
      if (showProgress) {
        $(selectors.progressWindow).hide();
      }
      if (typeof callback === 'function') {
        callback(e, data);
      }
    }).on('cloudinaryprogress', function(e, data) {
      if (showProgress) {
        $(selectors.progressBar).css('width',
          Math.round((data.loaded * 100.0) / data.total) + '%');
      }
    });
  },

  /**
   * upload image using preset feature of Cloudinary.com
   *
   * @param options
   *    cloudName: cloud_name of cloudinary.com
   *
   *    preset: preset name to applied to the upload image
   *
   *    options:
   *      multiple: if true, you can upload multiple files
   *
   *    buttonHTML: button HMTL code
   *
   *    progress:
   *      enable: if true, show upload progress bar
   *      window: selector of progress bar window
   *      bar: selector of progress bar
   *
   * @param callback: callback function to process the result
   *    callback parameters
   *      error: returned error when upload fails
   *      data: result value when upload succeeds
   */
  uploadImage: function(options, callback) {
    var self = this;

    options.addons = options.addons || {};

    if (options.buttonHTML) {
      this.setButtonHTML(options.buttonHTML);
    }

    Meteor.call('cloudinaryUploadTag', 'image_id', options.addons, function(error, response) {
      $(selectors.inputFile).remove();
      $(selectors.button).append(response);

      $.cloudinary.config(options.config);

      $(selectors.inputFile).cloudinary_fileupload(options.options);

      self.setEventHandler(selectors.inputFile, options.showProgress, callback);
    });
  },

  uploadImageDataURI: function(options, callback) {
    var self = this;

    options.addons = options.addons || {};

    if (options.buttonHTML) {
      this.setButtonHTML(options.buttonHTML);
    }

    Meteor.call('cloudinaryUploadTag', 'image_id', options.addons, function(error, response) {
      $(selectors.inputFile).remove();
      $(selectors.button).append(response);

      $.cloudinary.config(options.config);

      $(selectors.inputFile).fileupload('option', 'formData').file = options.data;
      $(selectors.inputFile).fileupload('add', { files: [ options.data ]});

      self.setEventHandler(selectors.inputFile, options.showProgress, callback);
    });
  },

  /**
   * upload image using preset feature of Cloudinary.com
   *
   * @param options
   *    cloudName: cloud_name of cloudinary.com
   *
   *    preset: preset name to applied to the upload image
   *
   *    options:
   *      multiple: if true, you can upload multiple files
   *
   *    buttonHTML: button HMTL code
   *
   *    progress:
   *      enable: if true, show upload progress bar
   *      window: selector of progress bar window
   *      bar: selector of progress bar
   *
   * @param callback: callback function to process the result
   *    callback parameters
   *      error: returned error when upload fails
   *      data: result value when upload succeeds
   */
  uploadImagePreset: function(options, callback) {
    var self = this;

    if (options.buttonHTML) {
      this.setButtonHTML(options.buttonHTML);
    }

    $(selectors.inputFile).unsigned_cloudinary_upload(
      options.preset,
      { cloud_name: options.config.cloud_name },
      options.options
    );
    self.setEventHandler(selectors.uploader, options.showProgress, callback);
  },

  uploadVideo: function(options, callback) {
    callback();
  },

  uploadFile: function(options, callback) {
    callback();
  }
};

Template.cloudinaryUploader.helpers({
  buttonHTML: function() {
    return Cloudinary.getButtonHTML();
  }
});
