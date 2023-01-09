<template>
<div class="row">
    <div class="col-12">
        <button class="add-button" @click="toggleModal()">new categorie</button>
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
                        <tr v-for="item in categories" :key="item.id">
                            <slot>
                                <td>
                                    {{item.id}}
                                </td>
                                <td>
                                    <router-link :to="{name: 'showCategorie', params: { category_id: item.id } }">
                                        {{item.category_name}}
                                    </router-link>
                                </td>
                                <td v-html="item.discription">
                                </td>
                                <td>
                                    {{parentCat(item.parent_id)}}
                                </td>
                                <td>
                                    <a href="" class="nav-link" @click.prevent="deleteCategory(item.id)"> <i class="tim-icons icon-trash-simple"></i></a>
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
							Add new category
						</slot>
					</div>

					<div class="modal-body">
						<slot >
                                <div class="input-data">
                                    <input type="text" v-model="form.category_name" required>
                                    <label for="name">Category name</label>
                                </div>
                                <div class="input-data">
                                    <ckeditor v-model="form.discription" :config="editorConfig"></ckeditor>
                                </div>
                          
						</slot>
                        <div class="upload-btn-wrapper">
                                <button class="bt-up">Upload a file</button>
                                <input type="file" name="image" ref="files" @change="setImage" />
                            </div>
					</div>

					<div class="modal-footer">
						<slot name="footer">
							<button class="modal-default-button" @click="addCategory()">
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
</div>
</template>

<script>
import {
    BaseTable
} from "@/components";
import {
    mapActions,
    mapGetters
} from 'vuex'

import Vue from 'vue';
import CKEditor from 'ckeditor4-vue';

Vue.use(CKEditor);
export default {
    data() {
        return {
            editorConfig: {
                height: '100px',
                resize_enabled: false
            },
            title: "Categories list",
            tableColumns: ["id", "Category name","discription", "parent name","actions"],
            categories: [],
            parents : [],
            form : {
                id : '',
                category_name : '',
                discription : '',
                image : '',
                parent_id : null
            },
            showModal: false,
            isUpdate : false
        };
    },
    methods: {
        ...mapActions({
            fetchCategories: 'categories/fetchCategories',
            destroyCategory: 'categories/destroyCategory',
            NewCategory: 'categories/NewCategory',
            updateCategory: 'categories/updateCategory',
        }),
        async fillCategories() {
            await this.fetchCategories()
                .then(() => {
                    this.categories = this.getCategories
                })
        },
        parentCat(parent_id) {
            if (parent_id !== null) {
                const index = this.categories.findIndex(x => x.id === parent_id);
                if (index != -1) {
                    return this.categories[index].category_name
                }
            } else {
                return "-----"
            }
        },
        deleteCategory(category_id) {
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
                    this.destroyCategory(category_id)
                    this.fillCategories()
                    Swal.fire(
                        'Deleted!',
                        'the category has been deleted.',
                        'success'
                    )
                }
            })
        },
        cancelHandle(){
            this.showModal = false
            this.isUpdate = false
            this.form.id = ''
            this.form.category_name = ''
            this.form.discription = ''
            this.form.image = ''
            this.form.parent_id = null
        },
        toggleModal() {
           this.showModal = true;
        },
        showUpdateModal(form) {
            this.parents = this.categories.filter(i => i.parent_id === null && i.id !== form.id)
            this.form.id = form.id
            this.form.category_name = form.category_name
            this.form.parent_id = form.parent_id
            this.showModal = true;
            this.isUpdate = true;
        },
        addCategory(){
            if(this.isUpdate){
                if(this.form.category_name != ""){
                    if(!Number.isInteger(this.form.parent_id)){
                        this.form.parent_id = null
                    }
                    this.updateCategory(this.form)
                    this.form.category_name = ''
                    this.form.parent_id = null
                    this.fillCategories()
                    this.showModal = false;
                    this.isUpdate = false;
                    this.form.id = ''
                    this.form.category_name = ''
                    this.form.parent_id = null
                }
            }
            else{
                if(this.form.category_name != ""){
                    if(!Number.isInteger(this.form.parent_id)){
                        this.form.parent_id = null
                    }
                    this.NewCategory(this.form)
                    this.form.category_name = ''
                    this.form.parent_id = null
                    this.fillCategories()
                    this.showModal = false;
                }
            }
            
        },
         setImage(e){
              let file = e.target.files[0];
              let reader = new FileReader();
              if(file.size < 2111775){
                reader.onloadend = () => this.form.image = reader.result
                reader.readAsDataURL(file);  
              }
        }
    },
    
    computed: {
        ...mapGetters({
            'getCategories': 'categories/getCategories',
        })
    },
    created() {
        this.fillCategories()
    }
};
</script>

<style scoped>

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


.table-responsive {
    overflow: hidden;
}

.nav-link {
    display: inline;
}
.btn-primary{
    float: right;
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

</style>
