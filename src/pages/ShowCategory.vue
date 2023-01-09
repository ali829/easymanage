<template>
    <div>

         <div class="table_container">
            <card title="">
                <div class="product">
                    <div class="product-picture" v-if="category.image != ''">
                        <img :src="category.image" alt="">
                    </div>
                    <div class="product-infos">
                        <div>
                            <h4>Category id : {{this.category.id}}</h4>
                        </div>
                        <div>
                            <h4>Product name : {{this.category.category_name}}</h4>
                        </div>
                        <div>
                            <h4>Discription  : <span v-html="category.discription"></span></h4>
                        </div>
                        <div class="cat_actions">
                             <button class="add-button" @click="shoUpdateCat(category)"><i class="tim-icons icon-pencil"></i></button>
                    <button class="add-button" @click="deleteCategory(category)"><i class="tim-icons icon-trash-simple"></i></button>
                        </div>

                    </div>
                </div>
            </card>
        </div>


        <div class="table_container" v-if="this.category.parent_id === null">
            <button class="add-button" @click="showAddSub()">new sub category</button>
            <card :title="title">
            <div class="table-responsive">
                <table class="table tablesorter">
                    <thead>
                        <tr>
                            <slot name="columns">
                                <th v-for="column in tableColumns" :key="column">{{column}}</th>
                            </slot>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in sub_categories" :key="item.id">
                            <slot>
                                <td>
                                    {{item.id}}
                                </td>
                                <td>
                                    <!-- <a href="" class="nav-link" @click.prevent="changeCat(item)">
                                        {{item.category_name}}
                                    </a> -->
                                    <router-link :to="{name: 'showCategorie', params: { category_id: item.id } }">
                                        {{item.category_name}}
                                    </router-link>
                                </td>
                                <td>
                                    {{parentCat()}}
                                </td>
                                <td>
                                    <a href="" class="nav-link" @click.prevent="shoUpdateSubCat(item)"> <i class="tim-icons icon-pencil"></i></a>
                                    <a href="" class="nav-link" @click.prevent="deleteSubCategory(item.id)"> <i class="tim-icons icon-trash-simple"></i></a>
                                </td>
                            </slot>
                        </tr>
                    </tbody>
                </table>
            </div>
            </card>
        </div>
        <div class="table_container">
        <button class="add-button" @click="showAddSubPro()">new sub product</button>
            <card title="sub products">
            <div class="table-responsive">
                <table class="table tablesorter">
                    <thead>
                        <tr>
                            <slot name="columns">
                                <th v-for="column in productsColumns" :key="column">{{column}}</th>
                            </slot>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in sub_products" :key="item.id">
                            <slot>
                                <td>
                                    {{item.id}}
                                </td>
                                <td>
                                    <router-link :to="{name: 'showProduct', params: { product_id : item.id } }">
                                        {{item.product_name}}
                                    </router-link>
                                </td>
                                <td>
                                    {{parentCat()}}
                                </td>
                                <td>
                                    <a href="" class="nav-link" @click.prevent="shoUpdateSubPro(item)"> <i class="tim-icons icon-pencil"></i></a>
                                    <a href="" class="nav-link" @click.prevent="deleteSubProduct(item)"> <i class="tim-icons icon-trash-simple"></i></a>
                                </td>
                            </slot>
                        </tr>
                    </tbody>
                </table>
            </div>
            </card>
        </div>

        <transition name="modal" v-if="showSubCatModal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					
					<div class="modal-header">
						<slot name="header">
							{{updateType == 'subcat' ? 'update sub category':'Add new sub category'}}
						</slot>
					</div>

					<div class="modal-body">
						<slot >
                                <div class="input-data">
                                    <input type="text" v-model="category_parent.category_name" required>
                                    <label for="name">Category name</label>
                                </div>
                                <div class="input-data">
                                    <ckeditor v-model="category_parent.discription" :config="editorConfig"></ckeditor>
                                </div>
                          
						</slot>
                            <div class="upload-btn-wrapper">
                                <button class="bt-up">Upload a file</button>
                                <input type="file" name="image" ref="files" @change="setImage" />
                            </div>
                        <div class="select" v-if="category.parent_id != null">
                            <select name="slct" id="slct" v-model="category_parent.parent_id">
                                <option v-for="item in categories" :key="item.id" v-bind:value="item.id" :selected="category_parent.parent_id ==item.id">{{item.category_name}}</option>
                            </select>
                        </div>
					</div>

					<div class="modal-footer">
						<slot name="footer">
							<button class="modal-default-button" @click="addCategory()">
                                save
                            </button>
							<button class="modal-cancel-button" @click="cancelHandle()">
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
                               add sub product
                            </slot>
                        </div>

                        <div class="modal-body">
                                <slot >
                                        <div class="input-data">
                                            <input type="text" id="name" v-model="sub_product.product_name" required>
                                            <label for="name">product name</label>
                                        </div>
                                
                                </slot>
                                <slot >
                                        <div class="input-data">
                                            <input type="text" id="optional_name" v-model="sub_product.optional_name"  required>
                                            <label for="name">product optional name</label>
                                        </div>
                                
                                </slot>
                                <slot >
                                        <div class="input-data">
                                            <ckeditor v-model="sub_product.discription_minimal" :config="editorConfig"></ckeditor>
                                        </div>
                                
                                </slot>
                                <slot >
                                        <div class="input-data">
                                            <ckeditor v-model="sub_product.discription_total" :config="editorConfig"></ckeditor>
                                        </div>
                                
                                </slot>
                                <slot >
                                        <div class="input-data">
                                            <input class="dimentions" type="text"  v-model="sub_product.weigth"  placeholder="weight">
                                        </div>
                                
                                </slot>
                                <slot >
                                        <div class="input-data">
                                            <input class="dimentions" type="text"  v-model="sub_product.length"  placeholder="length">
                                            <input class="dimentions" type="text"  v-model="sub_product.width"  placeholder="width">
                                            <input class="dimentions" type="text"  v-model="sub_product.heigth"  placeholder="heigth">
                                        </div>
                                
                                </slot>
                                <div class="upload-btn-wrapper">
                                    <button class="bt-up">Upload a file</button>
                                    <input type="file" name="image" ref="files" @change="setProductImages" multiple/>
                                </div>
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
    name : 'showCategory',
    data(){
        return {
            editorConfig: {
                height: '100px',
                resize_enabled: false
            },
            title: "sub categories",
            tableColumns: ["id", "Category name", "parent name","actions"],
            productsColumns: ["id", "product name", "category","actions"],
            category_parent :{
                category_name :'',
                image : '',
                discription : '',
                parent_id : ''
            },
            category : {},
            categories : [],
            sub_categories : [],
            sub_product : {
                id : '',
                product_name : '',
                optional_name : '',
                discription_minimal : '',
                discription_total : '',
                weigth : '',
                length : '',
                width : '',
                heigth : '',
                images : [],
                category_id : null
            },
            sub_products : [],
            showSubCatModal : false,
            showSubProModal : false,
            isUpdateSubCat : false,
            isUpdate : false,
            isUpdateSubCat : false,
            updateType : ''
        }
    },
    methods : {
         ...mapActions({
            removeProduct: 'categories/removeProduct',
            fetchSubCategories: 'categories/fetchSubCategories',
            fetchSubProducts: 'categories/fetchSubProducts',
            NewCategory: 'categories/NewCategory',
            updateCategory: 'categories/updateCategory',
            destroyCategory: 'categories/destroyCategory',
            addsubproduct: 'categories/addsubproduct',
            updateProduct: 'categories/updateProduct',
            fetchCat: 'categories/fetchCat',
            fetchCategories: 'categories/fetchCategories',
            
            
            

        }),
        changeCat(cat){
            this.category = cat
            this.fillsubCategories()
            this.fillsubProducts()
        },
        async fillCategories() {
            await this.fetchCategories()
                .then(() => {
                    this.categories = this.getCategories
                })
        },
        async fillsubCategories() {
            await this.fetchSubCategories(this.category.id)
                .then(() => {
                    this.sub_categories = this.getSubCategories
                })
        },
        async fillsubProducts() {
            await this.fetchSubProducts(this.category.id)
                .then(() => {
                    this.sub_products = this.getSubProducts
                })
        },
        setCategory_paren(){
            this.category_parent = this.category;
        },
        parentCat() {
            return this.category.category_name
        },
        showAddSub(){
            this.showSubCatModal =true
            this.category_parent.parent_id = this.category.id
        },
        cancelHandle(){
            this.showSubCatModal = false
            this.isUpdateSubCat = false
            this.category_parent.id = ''
            this.category_parent.category_name = ''
        },
        addCategory(){
            if(this.isUpdate){
                if(this.updateType === 'subcategory'){
                        if(this.category_parent.category_name != ""){
                            this.updateCategory(this.category_parent)
                            this.initialize()
                            this.category_parent.id = ''
                            this.category_parent.category_name = ''
                            this.category_parent.discription = ''
                            this.category_parent.parent_id = null
                            this.showSubCatModal = false;
                            this.isUpdate = false;
                            this.updateType = ''
                        }
                }
                else{
                    if(this.updateType === 'subpro'){

                    }
                    else{
                        if(this.category_parent.category_name != ""){

                            this.updateCategory(this.category_parent)
                            this.initialize()
                            this.category.id = this.category_parent.id 
                            this.category.category_name = this.category_parent.category_name 
                            this.category.parent_id = this.category_parent.parent_id 
                            this.category_parent.discription = ''
                            this.category_parent.image = ''
                            this.category_parent.category_name = ''
                            this.category_parent.parent_id = null
                            
                            this.showSubCatModal = false;
                            this.isUpdate = false;
                            this.updateType = ''
                        }
                    }
                }
                
            }
            else{
                if(this.category_parent.category_name != ""){
                    this.NewCategory(this.category_parent)
                    this.initialize()
                    this.category_parent.category_name = ''
                    this.category_parent.parent_id = null
                    this.showSubCatModal = false;
                }
            }
            
        },
        addSubProduct(){
            if(this.isUpdate){
                this.updateProduct(this.sub_product)
                this.isUpdate =false
                this.showSubProModal = false
                this.sub_product = {
                    id : '',
                    product_name : '',
                    optional_name : '',
                    discription_minimal : '',
                    discription_total : '',
                    weigth : '',
                    length : '',
                    width : '',
                    heigth : '',
                    images : [],
                    category_id : null
                }
                this.fillsubProducts()
            }
            else{
                this.addsubproduct(this.sub_product)
                this.showSubProModal = false
                this.sub_product = {
                    id : '',
                    product_name : '',
                    optional_name : '',
                    discription_minimal : '',
                    discription_total : '',
                    weigth : '',
                    length : '',
                    width : '',
                    heigth : '',
                    images : [],
                    category_id : null
                }
                this.fillsubProducts()
            }
        },
        deleteSubCategory(category_id) {
            Swal.fire({
                title: 'Delete Category',
                text: "Are you sure yo want to deletethis sub category ",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#b2bec3',
                confirmButtonText: 'delete!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.destroyCategory(category_id)
                    this.fillsubCategories()
                    this.fillsubProducts()
                    Swal.fire(
                        'Deleted!',
                        'the sub category has been deleted.',
                        'success'
                    )
                }
            })
        },
        deleteSubProduct(product) {
            Swal.fire({
                title: 'Delete Category',
                text: "Are you sure yo want to delete this sub product ",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#b2bec3',
                confirmButtonText: 'delete!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.removeProduct(product)
                    this.fillsubCategories()
                    this.fillsubProducts()
                    Swal.fire(
                        'Deleted!',
                        'the sub product has been deleted.',
                        'success'
                    )
                }
            })
        },
        deleteCategory(category) {
            Swal.fire({
                title: 'Delete Category',
                text: "Are you sure yo want to deletethis category ",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#b2bec3',
                confirmButtonText: 'delete!'
            }).then((result) => {
                if (result.isConfirmed) {
                    if(category.parent_id === null){
                        this.destroyCategory(category.id)
                        Swal.fire(
                            'Deleted!',
                            'the category has been deleted.',
                            'success'
                        )
                        this.$router.replace({
                            name : 'categories'
                        })
                    }
                    else{
                        this.destroyCategory(category.id)
                        this.fillsubCategories()
                        this.fillsubProducts()
                        Swal.fire(
                            'Deleted!',
                            'the category has been deleted.',
                            'success'
                        )
                    }
                }
            })
        },
        shoUpdateSubCat(cat){
            this.showSubCatModal = true
            this.isUpdate = true,
            this.updateType = 'subcategory'
            this.category_parent.id = cat.id
            this.category_parent.category_name = cat.category_name
            this.category_parent.parent_id = cat.parent_id
        },
        shoUpdateSubPro(pro){
            console.log(pro)
            this.isUpdate = true,
            this.updateType = 'subpro'
            this.sub_product.id = pro.id 
            this.sub_product.product_name = pro.product_name 
            this.sub_product.optional_name = pro.optional_name 
            this.sub_product.discription_minimal = pro.discription_minimal 
            this.sub_product.discription_total = pro.discription_total 
            this.sub_product.weigth = pro.weigth 
            this.sub_product.length = pro.demention_lon 
            this.sub_product.width = pro.demention_lar 
            this.sub_product.heigth = pro.demention_h 
            this.sub_product.category_id = pro.category_id 
            this.showSubProModal = true
            
        },
        showAddSubPro(){
            this.showSubProModal = true
            this.sub_product.category_id = this.category.id
            
        },
        handlleCancelsubpro(){
            this.showSubProModal = false
            this.isUpdate = false
            this.sub_product = {product_name : '', category_id : ''}
        },
        shoUpdateCat(cat){
            this.isUpdate = true,
            this.showSubCatModal = true
            this.updateType = 'cat'
            this.category_parent.id = cat.id
            this.category_parent.category_name = cat.category_name
            this.category_parent.discription = cat.discription
            this.category_parent.parent_id = cat.parent_id
        },
        async fetchCurrentCat(){
            await this.fetchCat(this.$route.params.category_id)
                .then(()=>{
                    this.category = this.getCurentCat
                })

        },
        async initialize(){
            await this.fetchCurrentCat()
            .then(()=>{
                if(this.category != null){
                    this.fillsubCategories()
                    this.fillsubProducts()
                    this.fillCategories()
                }
                else{
                    this.$router.replace({path : '/notfound'})
                }
                
            })
        },
        setImage(e){

            // console.log( this.category_parent.image);let file = e.target.files[0];
              let file = e.target.files[0];
              let reader = new FileReader();
              if(file.size < 2111775){
                reader.onloadend = () => this.category_parent.image = reader.result
                reader.readAsDataURL(file);  
              }
        },
        setProductImages(e){
              let files = e.target.files;
              if(files.length <= 3){
                  files.forEach(element => {
                    let reader = new FileReader();
                    if(element.size < 2111775){
                        reader.onloadend = () => this.sub_product.images.push(reader.result)
                        reader.readAsDataURL(element);  
                    }
                });
              }
        }
    },
    computed: {
        ...mapGetters({
            'getSubCategories': 'categories/getSubCategories',
            'getSubProducts': 'categories/getSubProducts',
            'getCurentCat': 'categories/getCurentCat',
            'getCategories': 'categories/getCategories',
        })
    },
    created(){
        this.initialize()
    }
}
</script>
<style  scoped>
.nav-link {
    display: inline;
}
.table-responsive {
    overflow: hidden;
}
.category_details{
    color: #fff;
    margin: 10px;
}
.category_details h4{
    margin-left: 10px;
}
.table_container{
   color: #fff;
    margin: 10px; 
}
.add-button{
    border: 1px solid #e14eca;
    background-color: transparent;
    color: #e14eca;
    padding: 10px;
    float: right;
    transition: ease-out .3s;
    margin: 10px;
}
.add-button:hover{
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
.bt-up{
    border: 1px solid #e14eca;
    background-color: transparent;
    color: #e14eca;
    padding: 10px;
    transition: ease-out .3s;
    margin-top: 38px;
    width: 338px;
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
.wrapper
{
  width: 450px;
  background: #fff;
  padding: 30px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  border-radius: 4px;
}

.wrapper .input-data
{
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  position: relative;
  
}

.wrapper .input-data input
{
  height: 40px;
  width: 100%;
  border: none;
  font-size: 17px;
  border-bottom: 2px solid #57606f;
}
.wrapper .input-data textarea
{
  height: 70px;
  width: 100%;
  border: none;
  resize: none;
  font-size: 17px;
  border-bottom: 2px solid #57606f;
}
.dimentions{
    width: 30%!important;
    margin-right: 10px;
}
.input-data input:focus ~ label,
.input-data input:valid ~ label
{
  transform: translateY(-20px);
  font-size: 15px;
  color: #4158d0;
}

.input-data input:focus
{
  border-bottom: 2px solid #341f97;
}

.wrapper .input-data label
{
  position: absolute;
  bottom: 10px;
  left: 0;
  color: #57606f;
  pointer-events: none;
  transition: all 0.3s ease;
}
.cat_actions{
    display: flex;
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
  margin-top: 35px;
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
.wrapper .input-data textarea
{
  height: 50px;
  width: 100%;
  border: none;
  font-size: 17px;
  border-bottom: 2px solid #57606f;
  margin-top: 15px;
  margin-bottom: 10px;
}

.input-data textarea:focus ~ label,
.input-data textarea:valid ~ label
{
  transform: translateY(-20px);
  font-size: 15px;
  color: #4158d0;
}

.input-data textarea:focus
{
  border-bottom: 2px solid #341f97;
}

.wrapper .input-data label
{
  position: absolute;
  bottom: 10px;
  left: 0;
  color: #57606f;
  pointer-events: none;
  transition: all 0.3s ease;
}
.bt-up{
    border: 1px solid #e14eca;
    background-color: transparent;
    color: #e14eca;
    padding: 10px;
    transition: ease-out .3s;
    margin-top: 38px;
    width: 360px;
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

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.product-picture{
    margin: 10px;
    padding: 4px;
    width: 250px;
    height: 250px;
}
.product-picture img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.product{
        display: flex;
} 
@media screen and (max-width: 500px) {
    .product{
        display: block;
        padding: 10px;
        padding-right: 30px;
    } 
    .product-picture{
        margin: 10px;
        padding: 4px;
        width: 100%;
        height: 400px;
    }   
    .product-infos{
        padding: 10px;
    }
}
</style>