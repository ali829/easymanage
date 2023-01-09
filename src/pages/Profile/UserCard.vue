<template>
  <card type="user">
    <p class="card-text">
    </p>
    <div class="author">
      <div class="block block-one"></div>
      <div class="block block-two"></div>
      <div class="block block-three"></div>
      <div class="block block-four"></div>
      <a href="#">
        <img class="avatar" :src="model.image != '' ? model.image : 'img/anime6.png'" alt="...">
        <h5 class="title">{{model.name}}</h5>
      </a>
      <div class="upload-btn-wrapper">
          <button class="bt-up">Upload profile</button>
          <input type="file" name="image" ref="files" @change="setImage" />
      </div>
    </div>
    <div slot="footer" class="button-container">
      <base-button icon round class="btn-facebook">
        <i class="fab fa-facebook"></i>
      </base-button>
      <base-button icon round class="btn-twitter">
        <i class="fab fa-twitter"></i>
      </base-button>
      <base-button icon round class="btn-google">
        <i class="fab fa-google-plus"></i>
      </base-button>
    </div>
  </card>
</template>
<script>
  export default {
    props: {
      model: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    methods : {
      setImage(e){
              let file = e.target.files[0];
              let reader = new FileReader();
              if(file.size < 2111775){
                reader.onloadend = () => this.model.image = reader.result
                reader.readAsDataURL(file);  
              }
        }
    }
  }
</script>
<style scoped>
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.upload-btn-wrapper input[type=file] {
  font-size: 26px;
    position: absolute;
    left: 0;
    top: 35px;
    width: 200px;
    opacity: 0;
}
.bt-up{
    border: 1px solid #e14eca;
    background-color: transparent;
    color: #e14eca;
    padding: 10px;
    transition: ease-out .3s;
    margin-top: 38px;
    width: 200px;
}
.btn-up:hover{
    background-color: #e14eca;
    color: #fff;
}
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}
</style>>

</style>
