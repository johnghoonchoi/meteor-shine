// CropAvatar() 생성자 함수
CropAvatar = function() {
  this.$container = $('body');
  this.$avatarView = this.$container.find('.avatar-view');
  this.$avatar = this.$avatarView.find('img');
  this.$avatarModal = this.$container.find('#avatarModal');
  this.$loading = this.$container.find('.spinner-wrapper');
  this.$avatarInput = this.$avatarModal.find('.cloudinary_fileupload');
  this.$avatarSave = this.$avatarModal.find('#saveBtn');
  this.$avatarWrapper = this.$avatarModal.find('.avatar-wrapper');
};

CropAvatar.prototype = {
  constructor: CropAvatar,

  init: function () {
    this.initModal();
    this.addListener();
  },

  initModal: function () {
    this.$avatarModal.modal({
      show: false
    });
  },

  initPreview: function () {
    //var url = this.$avatar.attr('src');
  },

  addListener: function () {
    this.$avatarView.on('click', $.proxy(this.click, this));
    //Events > Event Handler Attachment | Utilities
    // 함수와 스코프를 인자로 갖는다.
    //"proxy" 함수는 jQuery의 네임스페이스를 관리
    //jQuery.proxy( function, context [, additionalArguments ] )
  },

  click: function () {
    this.initPreview();
    this.$avatarModal.modal('show');
  },

  startCropper: function () {
    var self = this;

    // 이미 팬딩한 상태의 이미지가 url로 되어 있는 경우
    // url만 교체
    if (this.active) {
      this.$img.cropper('replace', this.url);
    } else {
      this.$img = $('<img src="' + this.url + '" id="avatarPreview" >');
      this.$avatarWrapper.empty().html(this.$img);
      this.$img.cropper({
        aspectRatio: 1,
        strict: false
        //crop: function (data) {
        //  var json = [
        //    '{"x":' + data.x,
        //    '"y":' + data.y,
        //    '"height":' + data.height,
        //    '"width":' + data.width,
        //    '"rotate":' + data.rotate + '}'
        //  ].join();
        //
        //  self.$avatarData.val(json);
        //}
      });

      // 업로드 진행중인경우 true로 변경
      this.active = true;
    }


    this.$avatarModal.one('hidden.bs.modal', function () {
      //self.$avatarPreview.empty();
      self.stopCropper();
    });
  },

  isImageFile: function (file) {
    if (file.type) {
      return /^image\/\w+$/.test(file.type);
    } else {
      return /\.(jpg|jpeg|png|gif)$/.test(file);
    }
  },

  stopCropper: function () {
    if (this.active) {
      this.$img.cropper('destroy');
      this.$img.remove();
      this.active = false;
    }
  },

  cropDone: function () {
    this.$avatarForm.get(0).reset();
    this.$avatar.attr('src', this.url);
    this.stopCropper();
    this.$avatarModal.modal('hide');
  }

};
