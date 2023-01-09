<template>
  <div>
    <div class="table_container" v-if="product != null">
      <card title="">
        <div class="product">
          <div class="product-infos">
            <div>
              <h4>category id : {{this.product.id}}</h4>
            </div>
            <div>
              <h4>product name : {{this.product.product_name}}</h4>
            </div>
            <div>
              <h4>product optional name : {{this.product.optional_name}}</h4>
            </div>
            <div>
              <h4>product discription : <span v-html="this.product.discription_minimal"></span> </h4>
            </div>
            <div>
              <h4>category name : {{this.product.category_name}}</h4>
            </div>
            <div class="cat_actions">
              <button class="add-button" @click="shoUpdateSubPro(product)"><i
                  class="tim-icons icon-pencil"></i></button>
              <button class="add-button" @click="deleteProduct(product)"><i
                  class="tim-icons icon-trash-simple"></i></button>
            </div>

          </div>
        </div>
      </card>
    </div>
    <div class="table_container" v-if="product != null && product.images.length != 0">
      <card title="" style="display: flex;">
        <div class="product-pictures">
          <div class="product-picture" v-for="image in product.images" :key="image.id">
            <img :src="image.url" alt="">
          </div>

        </div>
      </card>
    </div>

    <div class="table-container" v-if="product != null">

      <button class="add-button" @click="toggleModal()">new option</button>

      <card title="product options">
        <div class="table-responsive">
          <table class="table tablesorter">
            <thead>
              <tr>
                <slot name="columns">
                  <th v-for="column in optionColumns" :key="column">{{column}}</th>
                </slot>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in options" :key="item.id">
                <slot>
                  <td>
                    {{item.id}}
                  </td>
                  <td>
                    {{item.option_name}}
                  </td>
                  <td>
                    <span v-for="val in item.option_values" :key="val.id">{{`${val.value} , `}}</span>
                  </td>
                  <td>
                    <a href="" class="nav-link" @click.prevent="showUpdateModal(item)"> <i
                        class="tim-icons icon-pencil"></i></a>
                    <a href="" class="nav-link" @click.prevent="deleteOption(item.id)"> <i
                        class="tim-icons icon-trash-simple"></i></a>
                  </td>
                </slot>
              </tr>
            </tbody>
          </table>
        </div>
      </card>
    </div>

    <div class="table-container" v-if="product != null">

      <button class="add-button" @click="toggleVariantModal()">new variant</button>

      <card title="product options">
        <div class="table-responsive">
          <table class="table tablesorter">
            <thead>
              <tr>
                <slot name="columns">
                  <th v-for="column in variantColumns" :key="column">{{column}}</th>
                </slot>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in variants" :key="item.id">
                <slot>
                  <td>
                    {{item.id}}
                  </td>
                  <td>
                    <div class="variant_pictre">
                      <img :src="item.image" :alt="item.variant_name">
                    </div>
                  </td>
                  <td>
                    {{ variantName(item.variant_name)}}
                  </td>
                  <td>
                    {{variant_options(item.option_values)}}
                  </td>
                  <td>
                    {{item.price}}
                    <!-- <span v-for="val in item.option_values" :key="val.id">{{`${val.value} , `}}</span>                                 -->
                  </td>
                  <td>
                    <a href="" class="nav-link" @click.prevent="showUpdateVariantModal(index)"> <i
                        class="tim-icons icon-pencil"></i></a>
                    <a href="" class="nav-link" @click.prevent="deleteVariant(item.id)"> <i
                        class="tim-icons icon-trash-simple"></i></a>
                  </td>
                </slot>
              </tr>
            </tbody>
          </table>
        </div>
      </card>
    </div>

    <transition name="modal" v-if="showModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
                Add new option
              </slot>
            </div>

            <div class="modal-body">
              <slot>
                <div class="input-data">
                  <input type="text" v-model="option.option_name" required>
                  <label for="name">Option name</label>
                </div>
              </slot>
              <div>
                <div v-for="(value,index) in this.option.option_values" :key="index" class="input-data-values">
                  <input type="text" placeholder="value" v-model="value.value" required>

                  <button @click="deleteOptionValue(index)">
                    <i class="tim-icons icon-trash-simple"></i>
                  </button>
                </div>


              </div>
              <div class="add-value">
                <button class="add-button" @click.prevent="addOptionValue()"><i
                    class="tim-icons icon-simple-add"></i></button>
              </div>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button class="modal-default-button" @click="addNewOption()">
                  save
                </button>
                <button class="modal-cancel-button" @click="cancelHandle">
                  cancel
                </button>
              </slot>
            </div>

          </div>
        </div>
      </div>
    </transition>

    <transition name="modal" v-if="showVariantModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
                Add new option
              </slot>
            </div>

            <div class="modal-body">
              <slot>
                <div class="input-data">
                  <input type="text" v-model="variant.variant_name" required>
                  <label for="name">variant name</label>
                </div>
              </slot>
              <slot>
                <div class="input-data">
                  <input type="text" v-model="variant.price" required>
                  <label for="name">variant price</label>
                </div>
              </slot>
              <slot>
                <div class="input-data">
                  <ckeditor v-model="variant.discription" :config="editorConfig"></ckeditor>
                </div>
              </slot>
              <div class="upload-btn-wrapper">
                <button class="bt-up">Upload a file</button>
                <input type="file" name="image" ref="files" @change="setVariantImage" multiple />
              </div>
              <slot>
                <ul v-for="option in options" :key="option.id">
                  <li>
                    {{option.option_name}}
                    <div>
                      <ul class="flex-options">
                        <li v-for="(option_value,index) in option.option_values" :key="index">
                          <div class="form-check form-check-radio">
                            <label :for="option_value.id" class="form-check-label">
                              <input type="radio" class="form-check-input" :id="option_value.id" :name="option.id"
                                :value="option_value.id" @change="addValueToVariant(option_value)"
                                :checked="checkifexist(option_value.id)">{{option_value.value}} <span
                                class="form-check-sign">
                              </span>
                            </label>
                          </div>

                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </slot>

            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button class="modal-default-button" @click="addNewVariant()">
                  save
                </button>
                <button class="modal-cancel-button" @click="cancelVariantHandle">
                  cancel
                </button>
              </slot>
            </div>

          </div>
        </div>
      </div>
    </transition>

    <transition name="modal" v-if="showSubProModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
                edit product
              </slot>
            </div>

            <div class="modal-body">
              <slot>
                <div class="input-data">
                  <input type="text" id="name" v-model="sub_product.product_name" required>
                  <label for="name">product name</label>
                </div>

              </slot>
              <slot>
                <div class="input-data">
                  <input type="text" id="optional_name" v-model="sub_product.optional_name" required>
                  <label for="name">product optional name</label>
                </div>

              </slot>
              <slot>
                <div class="input-data">
                  <ckeditor v-model="sub_product.discription_minimal" :config="editorConfig"></ckeditor>
                </div>

              </slot>
              <slot>
                <div class="input-data">
                  <ckeditor v-model="sub_product.discription_total" :config="editorConfig"></ckeditor>
                </div>

              </slot>
              <slot>
                <div class="input-data">
                  <input class="dimentions" type="text" v-model="sub_product.weigth" placeholder="weight">
                </div>

              </slot>
              <slot>
                <div class="input-data">
                  <input class="dimentions" type="text" v-model="sub_product.length" placeholder="length">
                  <input class="dimentions" type="text" v-model="sub_product.width" placeholder="width">
                  <input class="dimentions" type="text" v-model="sub_product.heigth" placeholder="heigth">
                </div>

              </slot>
              <div class="upload-btn-wrapper">
                <button class="bt-up">Upload a file</button>
                <input type="file" name="image" ref="files" @change="setImage" multiple />
              </div>
              <slot>
                <div class="select">
                  <select name="slct" id="slct" v-model="sub_product.category_id">
                    <option v-for="item in categories" :key="item.id" v-bind:value="item.id">{{item.category_name}}
                    </option>
                  </select>
                </div>
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button class="modal-default-button" @click="addSubProduct()">
                  save
                </button>
                <button class="modal-cancel-button" @click="handlleCancelsubpro()">
                  cancel
                </button>
              </slot>
            </div>

          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex'
  import Vue from 'vue';
  import CKEditor from 'ckeditor4-vue';

  Vue.use(CKEditor);


  export default {
    name: 'showProduct',
    data() {
      return {
        editorConfig: {
          height: '100px',
          resize_enabled: false
        },
        optionColumns: ["id", "option name", "values", "actions"],
        variantColumns: ["id", "photo", "variant name", "options", "price", "actions"],
        options: [],
        sub_product: {
          id: '',
          product_name: '',
          optional_name: '',
          discription_minimal: '',
          discription_total: '',
          weigth: '',
          length: '',
          width: '',
          heigth: '',
          images: [],
          category_id: null
        },
        variants: [],
        option: {
          id: '',
          option_name: '',
          product_id: '',
          option_values: [{
            id: '',
            value: ''
          }]
        },
        product: {
          id: '',
          product_name: '',
          optional_name: '',
          discription_minimal: '',
          discription_total: '',
          weigth: '',
          length: '',
          width: '',
          heigth: '',
          images: [],
          category_id: null
        },
        categories: [],
        variant: {
          variant_name: '',
          discription: '',
          product_id: '',
          price: '',
          image: '',
          option_values: []
        },
        pictures_names: [],
        showModal: false,
        showVariantModal: false,
        isUpdate: false,
        isUpdateVariant: false,
        showSubProModal: false
      }
    },
    methods: {
      ...mapActions({
        fetchOptions: 'options/fetchOptions',
        destroyOption: 'options/destroyOption',
        NewOption: 'options/NewOption',
        updateOption: 'options/updateOption',
        newVariant: 'variants/newVariant',
        UpdateVariant: 'variants/UpdateVariant',
        getProductVariants: 'variants/getProductVariants',
        destroyVariant: 'variants/destroyVariant',
        fetchPro: 'products/fetchPro',
        destroyProduct: 'products/destroyProduct',
        updateProduct: 'products/updateProduct',
        allcategories: 'categories/allcategories',
      }),
      async fillAllCategories() {
        await this.allcategories()
          .then(() => {
            this.categories = this.getAllCategories
          })
      },
      showUpdateVariantModal(index) {
        this.variant = this.variants[index]
        this.showVariantModal = true
        this.isUpdateVariant = true
      },
      deleteVariant(id) {
        Swal.fire({
          title: 'Delete Category',
          text: "Are you sure yo want to delete this option ",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#b2bec3',
          confirmButtonText: 'delete!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.destroyVariant(id)
            this.fillVariants()
            Swal.fire(
              'Deleted!',
              'the variant has been deleted.',
              'success'
            )
          }
        })
      },
      variantName(variant_name) {
        return this.product.product_name + ' ' + variant_name
      },
      variant_options(option_values) {
        let values_names = []
        option_values.forEach(element => {
          values_names.push(element.value)
        })
        return values_names
      },
      async fillOptions() {
        await this.fetchOptions(this.product.id)
          .then(() => {
            this.options = this.getOptions
          })
      },
      async fillVariants() {
        await this.getProductVariants(this.product.id)
          .then(() => {
            this.variants = this.getVariants
          })
      },
      toggleModal() {
        this.showModal = true;
        this.option = {
          id: '',
          option_name: '',
          product_id: this.product.id,
          option_values: [{
            id: '',
            value: ''
          }]
        }
      },
      toggleVariantModal() {
        this.showVariantModal = true
        this.variant = {
          variant_name: '',
          image: '',
          product_id: this.product.id,
          price: '',
          option_values: []
        }
      },
      cancelVariantHandle() {
        this.showVariantModal = false
        this.isUpdateVariant = false
        this.variant = {
          variant_name: '',
          discription: '',
          product_id: this.product.id,
          price: '',
          option_values: []
        }
      },
      cancelHandle() {
        this.showModal = false
        this.isUpdate = false
        this.option.id = ''
        this.option.option_name = ''
        this.option.product_id = ''
        this.option.option_values = [{
          value: ''
        }]
      },
      addOptionValue() {
        this.option.option_values.push({
          id: '',
          value: ''
        })
      },
      deleteOptionValue: function (index) {
        this.option.option_values.splice(index, 1);
        if (index === 0 && this.option.option_values.length == 0) {
          this.addOptionValue()
        }
      },
      async addNewOption() {
        if (this.isUpdate) {
          if (this.option.option_name !== "") {
            await this.updateOption(this.option)
              .then(() => {
                this.initialize()
              })
              .catch(err => console.log(err))
            this.showModal = false;
            this.isUpdate = false;
            // this.option.id = ''
            // this.option.option_name = ''
            // this.option.option_values = [{value : ''}]
            Swal.fire(
              'updated!',
              'the option has been created.',
              'success'
            )
            this.fillOptions()

          }
        } else {
          if (this.option.option_name !== "") {
            this.NewOption(this.option)
              .then(() => {
                this.option.option_name = ''
                this.option.product_id = ''
                this.option.option_values = [{
                  value: ''
                }]
                // this.fillOptions()
                this.initialize()
                this.showModal = false;
                Swal.fire(
                  'created!',
                  'the option has been created.',
                  'success'
                )
              })
          }
        }
      },
      deleteOption(option_id) {
        Swal.fire({
          title: 'Delete Category',
          text: "Are you sure yo want to delete this option ",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#b2bec3',
          confirmButtonText: 'delete!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.destroyOption(option_id).then(() => {
              this.fillVariants()
              this.fillOptions()
              Swal.fire(
                'Deleted!',
                'the category has been deleted.',
                'success'
              )
            })

          }
        })
      },
      showUpdateModal(form) {
        this.option.id = form.id
        this.option.option_name = form.option_name
        this.option.option_values = form.option_values
        this.showModal = true;
        this.isUpdate = true;
      },
      addNewVariant() {
        if (this.isUpdateVariant) {
          this.UpdateVariant(this.variant)
            .then(() => {
              this.showVariantModal = false
              this.isUpdateVariant = false
              Swal.fire(
                'updated!',
                'the variant has been updated.',
                'success'
              )
              this.initialize()
              this.variant = {
                variant_name: '',
                product_id: this.product.id,
                price: '',
                option_values: []
              }

            })
        } else {
          if (this.variant.variant_name !== "" && this.variant.option_values !== null) {
            this.newVariant(this.variant)
            this.showVariantModal = false
            this.isUpdateVariant = false
            this.variant = {
              variant_name: '',
              product_id: this.product.id,
              price: '',
              option_values: []
            }
            this.fillVariants()
            Swal.fire(
              'created!',
              'the variant has been added.',
              'success'
            )
          }
        }
      },
      addValueToVariant(option_value) {
        const index = this.variant.option_values.findIndex((element) => element.option_id == option_value.option_id)
        if (index === -1) {
          this.variant.option_values.push({
            id: option_value.id,
            option_id: option_value.option_id
          })
        } else {
          this.variant.option_values[index] = {
            id: option_value.id,
            option_id: option_value.option_id
          }
        }
      },
      async fetchCurrentPro() {
        await this.fetchPro(this.$route.params.product_id)
          .then(() => {
            this.product = this.getCurentPro
          })

      },

      async initialize() {
        await this.fetchCurrentPro()
          .then(() => {
            if (this.product != null) {
              this.fillOptions()
              this.fillVariants()
              this.fillAllCategories()
            } else {
              this.$router.replace({
                path: '/notfound'
              })
            }
          })
      },
      checkifexist(v_id) {
        return this.variant.option_values.some(function (el) {
          return el.id === v_id;

        });
      },
      deleteProduct(product) {
        Swal.fire({
          title: 'Delete Category',
          text: `Are you sure yo want to delete this product :  ${product.product_name}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#b2bec3',
          confirmButtonText: 'delete!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.destroyProduct(product.id)
            Swal.fire(
              'Deleted!',
              `the ${product.product_name} has been deleted.`,
              'success'
            )
            this.$router.push({
              name: 'products'
            })
          }
        })
      },
      shoUpdateSubPro(pro) {
        this.sub_product.id = pro.id
        this.sub_product.product_name = pro.product_name
        this.sub_product.optional_name = pro.optional_name
        this.sub_product.discription_minimal = pro.discription_minimal
        this.sub_product.discription_total = pro.discription_total
        this.sub_product.weigth = pro.weigth
        this.sub_product.length = pro.length
        this.sub_product.width = pro.width
        this.sub_product.heigth = pro.heigth
        this.sub_product.category_id = pro.category_id
        this.showSubProModal = true

      },
      addSubProduct() {
        this.updateProduct(this.sub_product)
          .then(() => {
            this.initialize()
            this.showSubProModal = false
            this.sub_product = {
              product_name: '',
              category_id: '',
              images: []
            }
          })

      },
      handlleCancelsubpro() {
        this.showSubProModal = false
        this.pictures_names = []
        this.sub_product = {
          id: '',
          product_name: '',
          optional_name: '',
          discription_minimal: '',
          discription_total: '',
          weigth: '',
          length: '',
          width: '',
          heigth: '',
          images: [],
          category_id: null
        }
      },
      setImage(e) {
        let files = e.target.files;
        if (files.length <= 3) {
          files.forEach(element => {
            let reader = new FileReader();
            if (element.size < 2111775) {
              reader.onloadend = () => this.sub_product.images.push(reader.result)
              reader.readAsDataURL(element);
            }
          });
        }
      },
      setVariantImage(e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        if (file.size < 2111775) {
          reader.onloadend = () => {
            this.variant.image = reader.result
          }
          reader.readAsDataURL(file);
        }
      }
    },
    computed: {
      ...mapGetters({
        'getOptions': 'options/getOptions',
        'getVariants': 'variants/getVariants',
        'getCurentPro': 'products/getCurentPro',
        'getAllCategories': 'categories/getAllCategories',
      })
    },
    created() {
      this.initialize()
    }

  }

</script>

<style scoped>
  .nav-link {
    display: inline;
  }

  .table-responsive {
    overflow: hidden;
  }

  .category_details {
    color: #fff;
    margin: 10px;
  }

  .category_details h4 {
    margin-left: 10px;
  }

  .table_container {
    color: #fff;
    margin: 10px;
  }

  .add-button {
    border: 1px solid #e14eca;
    background-color: transparent;
    color: #e14eca;
    padding: 10px;
    float: right;
    transition: ease-out .3s;
    margin: 10px;
  }

  .add-button:hover {
    background-color: #e14eca;
    color: #fff;
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    -webkit-transition: opacity 0.3s ease;
    transition: opacity 0.3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 25rem;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header {
    background: #e14eca;
    padding: 20px;
    color: #fff;
  }

  .modal-header h3 {
    margin: 0;
    color: white;
  }

  .modal-body {
    margin: 10px 0px;
    padding: 20px 20px;
    max-height: 463px;
    overflow: auto;
  }

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
    width: 338px;
    opacity: 0;
  }

  .bt-up {
    border: 1px solid #e14eca;
    background-color: transparent;
    color: #e14eca;
    padding: 10px;
    transition: ease-out .3s;
    margin-top: 38px;
    width: 338px;
  }

  .btn-up:hover {
    background-color: #e14eca;
    color: #fff;
  }

  .upload-btn-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;

  }

  .modal-footer {
    padding: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    display: -webkit-box;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
  }

  .modal-footer .modal-default-text {
    -webkit-box-flex: 1;
    flex: 1;
  }

  .modal-footer .modal-default-button {
    cursor: pointer;
    background: #e14eca;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 8px 16px;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .modal-footer .modal-default-button:hover {
    background-color: #673dcb;
  }

  .modal-footer .modal-cancel-button {
    cursor: pointer;
    background: #673dcb;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 8px 16px;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .modal-footer .modal-cancel-button:hover {
    background-color: #673dcb;
  }

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .wrapper {
    width: 450px;
    background: #fff;
    padding: 30px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .wrapper .input-data {
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    position: relative;

  }

  .wrapper .input-data input {
    height: 40px;
    width: 100%;
    border: none;
    font-size: 17px;
    border-bottom: 2px solid #57606f;
  }

  .wrapper .input-data textarea {
    height: 70px;
    width: 100%;
    border: none;
    resize: none;
    font-size: 17px;
    border-bottom: 2px solid #57606f;
  }

  .dimentions {
    width: 30% !important;
    margin-right: 10px;
  }

  .input-data input:focus~label,
  .input-data input:valid~label {
    transform: translateY(-20px);
    font-size: 15px;
    color: #4158d0;
  }

  .input-data input:focus {
    border-bottom: 2px solid #341f97;
  }

  .wrapper .input-data label {
    position: absolute;
    bottom: 10px;
    left: 0;
    color: #57606f;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .cat_actions {
    display: flex;
  }

  .product-picture {
    margin: 10px;
    padding: 4px;
    width: 250px;
    height: 250px;
  }

  .product-pictures {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 10px;
    padding: 4px;
    margin: 0;
  }

  .product-picture img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product {
    display: flex;
  }

  .input-data-values {
    height: 40px;
    width: 100%;
    position: relative;
    display: flex;
    margin-top: 10px;
  }

  .input-data-values input {
    margin-right: 5px;
    height: 100%;
    width: 40%;
    border: none;
    font-size: 12px;
    border-bottom: 2px solid #57606f;
  }

  .input-data-values button {
    border: none;
    color: #e14eca;
    background-color: transparent;
    cursor: pointer;
  }

  .input-data-values input:focus {
    border-bottom: 2px solid #341f97;
  }

  .input-data-values label {
    position: absolute;
    bottom: 10px;
    left: 0;
    color: #57606f;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .add-value {
    width: 100;
    height: 40px;
  }

  ul {
    padding-left: 10px;
  }

  ul,
  li {
    color: black !important;
    margin-top: 4px;

  }

  ul li {
    display: block;
  }

  .flex-options {
    display: flex;
  }

  .flex-options li {
    display: inline;
    margin-right: 10px;
  }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;
    outline: 0;
    box-shadow: none;
    border: 0 !important;
    background: #2c3e50;
    background-image: none;
  }

  /* Remove IE arrow */
  select::-ms-expand {
    display: none;
  }

  /* Custom Select */
  .select {
    position: relative;
    display: flex;
    width: 100%;
    height: 3em;
    line-height: 3;
    background: #2c3e50;
    overflow: hidden;
    border-radius: .25em;
    margin-top: 10px;
  }

  select {
    flex: 1;
    padding: 0 .5em;
    color: #fff;
    cursor: pointer;
  }

  /* Arrow */
  .select::after {
    content: '\25BC';
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 1em;
    background: #34495e;
    cursor: pointer;
    pointer-events: none;
    -webkit-transition: .25s all ease;
    -o-transition: .25s all ease;
    transition: .25s all ease;
  }

  /* Transition */
  .select:hover::after {
    color: #f39c12;
  }

  .upload-btn-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
  }

  .upload-btn-wrapper input[type=file] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }


  .bt-up {
    border: 1px solid #e14eca;
    background-color: transparent;
    color: #e14eca;
    padding: 10px;
    transition: ease-out .3s;
    margin-top: 38px;
    width: 360px;
  }

  .btn-up:hover {
    background-color: #e14eca;
    color: #fff;
  }

  .upload-btn-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;

  }

  .variant_pictre {
    width: 150px;
    height: 150px;
  }

  .variant_pictre img {
    width: 150px;
    height: 150px;
    object-fit: cover;
  }

  @media screen and (max-width: 500px) {
    .product {
      display: block;
      padding: 10px;
      padding-right: 30px;
    }

    .product-picture {
      margin: 10px;
      padding: 4px;
      width: 100%;
      height: 400px;
    }

    .product-pictures {
      display: block;
      margin: 0 auto;
      padding: 10px;
      padding-right: 30px;
    }

    .product-infos {
      padding: 10px;
    }
  }

</style>
