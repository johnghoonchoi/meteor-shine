//(function (factory) {
//  if (typeof define === 'function' && define.amd) {
//    define(['jquery'], factory);
//  } else if (typeof exports === 'object') {
//    // Node / CommonJS
//    factory(require('jquery'));
//  } else {
//    factory(jQuery);
//  }
//})(function ($) {
//
//  'use strict';
//
//  var console = window.console || { log: function () {} };
//
//  function CropAvatar() {
//
//    this.$container = $('body');
//
//    //profile view page
//    this.$avatarView = this.$container.find('.avatar-view');
//    this.$avatar = this.$avatarView.find('img');
//    //profile picture page
//    this.$avatarModal = this.$container.find('#avatarModal');
//    this.$loading = this.$container.find('.spinner-wrapper');
//    this.$avatarInput = this.$avatarModal.find('.cloudinary_fileupload');
//    this.$avatarSave = this.$avatarModal.find('#saveBtn');
//    this.$avatarWrapper = this.$avatarModal.find('.avatar-wrapper');
//
//    //this.$avatarForm = this.$avatarModal.find('.avatar-form');
//    //this.$avatarUpload = this.$avatarForm.find('.avatar-upload');
//    //this.$avatarSrc = this.$avatarForm.find('.avatar-src');
//    //this.$avatarData = this.$avatarForm.find('.avatar-data');
//    //this.$avatarBtns = this.$avatarForm.find('.avatar-btns');
//    //this.$avatarPreview = this.$avatarModal.find('.avatar-preview');
//
//    this.init();
//  }
//
//  CropAvatar.prototype = {
//    constructor: CropAvatar,
//
//    support: {
//      fileList: !!$('<input type="file">').prop('files'),
//      blobURLs: !!window.URL && URL.createObjectURL,
//      formData: !!window.FormData
//    },
//
//    init: function () {
//      this.support.datauri = this.support.fileList && this.support.blobURLs;
//
//      if (!this.support.formData) {
//        this.initIframe();
//      }
//
//      this.initTooltip();
//      this.initModal();
//      this.addListener();
//    },
//
//    addListener: function () {
//      this.$avatarView.on('click', $.proxy(this.click, this));
//      this.$avatarInput.on('change', $.proxy(this.change, this));
//      //this.$avatarForm.on('submit', $.proxy(this.submit, this));
//      //this.$avatarBtns.on('click', $.proxy(this.rotate, this));
//    },
//
//    initTooltip: function () {
//      this.$avatarView.tooltip({
//        placement: 'bottom'
//      });
//    },
//
//    initModal: function () {
//      this.$avatarModal.modal({
//        show: false
//      });
//    },
//
//    initPreview: function () {
//      var url = this.$avatar.attr('src');
//
//      this.$avatarPreview.html('<img src="' + url + '">');
//    },
//
//
//    click: function () {
//      this.$avatarModal.modal('show');
//      this.initPreview();
//    },
//
//    change: function () {
//      var files,
//        file;
//
//      if (this.support.datauri) {
//        files = this.$avatarInput.prop('files');
//
//        if (files.length > 0) {
//          file = files[0];
//
//          if (this.isImageFile(file)) {
//            if (this.url) {
//              URL.revokeObjectURL(this.url); // Revoke the old one
//            }
//
//            this.url = URL.createObjectURL(file);
//            this.startCropper();
//          }
//        }
//      } else {
//        file = this.$avatarInput.val();
//
//        if (this.isImageFile(file)) {
//          this.syncUpload();
//        }
//      }
//    },
//
//    submit: function () {
//      if (!this.$avatarSrc.val() && !this.$avatarInput.val()) {
//        return false;
//      }
//
//      if (this.support.formData) {
//        this.ajaxUpload();
//        return false;
//      }
//    },
//
//    rotate: function (e) {
//      var data;
//
//      if (this.active) {
//        data = $(e.target).data();
//
//        if (data.method) {
//          this.$img.cropper(data.method, data.option);
//        }
//      }
//    },
//
//    isImageFile: function (file) {
//      if (file.type) {
//        return /^image\/\w+$/.test(file.type);
//      } else {
//        return /\.(jpg|jpeg|png|gif)$/.test(file);
//      }
//    },
//
//
//
//
//    startCropper: function () {
//      var _this = this;
//
//      if (this.active) {
//        this.$img.cropper('replace', this.url);
//      } else {
//        this.$img = $('<img src="' + this.url + '">');
//        this.$avatarWrapper.empty().html(this.$img);
//        this.$img.cropper({
//          aspectRatio: 1,
//          preview: this.$avatarPreview.selector,
//          strict: false,
//          crop: function (data) {
//            var json = [
//              '{"x":' + data.x,
//              '"y":' + data.y,
//              '"height":' + data.height,
//              '"width":' + data.width,
//              '"rotate":' + data.rotate + '}'
//            ].join();
//
//            _this.$avatarData.val(json);
//          }
//        });
//
//        this.active = true;
//      }
//
//
//      this.$avatarModal.one('hidden.bs.modal', function () {
//        _this.$avatarPreview.empty();
//        _this.stopCropper();
//      });
//    },
//
//
//
//
//
//    stopCropper: function () {
//      if (this.active) {
//        this.$img.cropper('destroy');
//        this.$img.remove();
//        this.active = false;
//      }
//    },
//
//
//
//
//    syncUpload: function () {
//      this.$avatarSave.click();
//    },
//
//    submitStart: function () {
//      this.$loading.fadeIn();
//    },
//
//    submitDone: function (data) {
//      console.log(data);
//      if ($.isPlainObject(data) && data.state === 200) {
//        if (data.result) {
//          this.url = data.result;
//
//          if (this.support.datauri || this.uploaded) {
//            this.uploaded = false;
//            this.cropDone();
//          } else {
//            this.uploaded = true;
//            this.$avatarSrc.val(this.url);
//            this.startCropper();
//          }
//
//          this.$avatarInput.val('');
//
//        } else if (data.message) {
//          this.alert(data.message);
//        }
//      } else {
//        this.alert('Failed to response');
//      }
//    },
//
//    submitFail: function (msg) {
//      this.alert(msg);
//    },
//
//    submitEnd: function () {
//      this.$loading.fadeOut();
//    },
//
//
//
//
//
//    cropDone: function () {
//      this.$avatarForm.get(0).reset();
//      this.$avatar.attr('src', this.url);
//      this.stopCropper();
//      this.$avatarModal.modal('hide');
//    }
//
//
//
//
//
//
//  };
//
//  $(function () {
//    return new CropAvatar();
//  });
//
//});
