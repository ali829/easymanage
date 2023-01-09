<template>
<div class="row">
    <div class="col-12">
        <button class="add-button" @click="toggleModal()">new product</button>
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
                        <tr v-for="item in products" :key="item.id">
                            <slot>
                                <td>
                                    <div class="product_pictre">
                                        <img :src="item.images[0].url" :alt="item.product_name">
                                    </div>
                                </td>
                                <td>
                                    <router-link :to="{name: 'showProduct', params: { product_id: item.id } }">
                                        {{item.product_name}}
                                    </router-link>

                                </td>
                                <td>
                                    {{item.optional_name}}
                                </td>
                                <td>
                                    {{item.discription_minimal}}
                                </td>
                                <td>
                                    <a href="" class="nav-link" @click.prevent="deleteProduct(item)"> <i class="tim-icons icon-trash-simple"></i></a>
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
                        <slot>
                            <div class="input-data">
                                <input type="text" id="name" v-model="form.product_name" required>
                                <label for="name">product name</label>
                            </div>

                        </slot>
                        <slot>
                            <div class="input-data">
                                <input type="text" id="optional_name" v-model="form.optional_name" required>
                                <label for="name">product optional name</label>
                            </div>

                        </slot>
                        <slot>
                            <div class="input-data">
                                <ckeditor v-model="form.discription_minimal" :config="editorConfig"></ckeditor>
                            </div>

                        </slot>
                        <slot>
                            <div class="input-data">
                                <ckeditor v-model="form.discription_total" :config="editorConfig"></ckeditor>
                            </div>

                        </slot>
                        <slot>
                            <div class="input-data">
                                <input class="dimentions" type="text" v-model="form.weigth" placeholder="weight">
                            </div>

                        </slot>
                        <slot>
                            <div class="input-data">
                                <input class="dimentions" type="text" v-model="form.length" placeholder="length">
                                <input class="dimentions" type="text" v-model="form.width" placeholder="width">
                                <input class="dimentions" type="text" v-model="form.heigth" placeholder="heigth">
                            </div>

                        </slot>
                        <div class="upload-btn-wrapper">
                            <button class="bt-up">Upload a file</button>
                            <input type="file" name="image" ref="files" @change="setImage" multiple />
                        </div>
                        <slot>
                            <div class="select">
                                <select name="slct" id="slct" v-model="form.category_id">
                                    <option v-for="item in categories" :key="item.id" v-bind:value="item.id">{{item.category_name}}</option>
                                </select>
                            </div>
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="modal-default-button" @click="addProduct()">
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
            tableColumns: ["image", "product name", "optional name", "discription", "actions"],
            products: [],
            categories: [],
            form: {
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
            showModal: false,
        };
    },
    methods: {
        ...mapActions({
            fetchProducts: 'products/fetchProducts',
            destroyProduct: 'products/destroyProduct',
            newProduct: 'products/newProduct',
            fetchCategories: 'categories/fetchCategories',
        }),
        async fillProducts() {
            await this.fetchProducts()
                .then(() => {
                    this.products = this.getProducts
                })
            this.fillCategories()
        },
        async fillAllCategories() {
            await this.fetchCategories()
                .then(() => {
                    this.categories = this.getCategories
                })
        },
        fillCategories() {
            this.categories = this.getCategories
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
                    this.fillProducts()
                    Swal.fire(
                        'Deleted!',
                        `the ${product.product_name} has been deleted.`,
                        'success'
                    )
                }
            })
        },
        toggleModal() {
            this.fillCategories()
            this.form = {
                id: '',
                product_name: '',
                optional_name: '',
                dicription_minimal: '',
                dicription_total: '',
                weigth: '',
                length: '',
                width: '',
                height: '',
                images: [],
                category_id: null
            }
            this.showModal = true
        },
        cancelHandle() {
            this.form = {
                id: '',
                product_name: '',
                optional_name: '',
                dicription_minimal: '',
                dicription_total: '',
                weigth: '',
                length: '',
                width: '',
                height: '',
                images: [],
                category_id: null
            }
            this.showModal = false
        },
        addProduct() {
            if (this.form.product_name != "" && this.form.category_id != null) {
                this.newProduct(this.form)
                    .then(() => {
                        this.fillProducts()
                        this.showModal = false
                        Swal.fire(
                            'added!',
                            `the ${this.form.product_name} added succefully.`,
                            'success'
                        )
                        this.form = {
                            id: '',
                            product_name: '',
                            optional_name: '',
                            dicription_minimal: '',
                            dicription_total: '',
                            weigth: '',
                            length: '',
                            width: '',
                            height: '',
                            images: [],
                            category_id: null
                        }
                    })
            }
        },
        setImage(e) {
            let files = e.target.files;
            if (files.length <= 3) {
                files.forEach(element => {
                    let reader = new FileReader();
                    if (element.size < 2111775) {
                        reader.onloadend = () => this.form.images.push(reader.result)
                        reader.readAsDataURL(element);
                    }
                });
            }
        },
    },
    computed: {
        ...mapGetters({
            'getProducts': 'products/getProducts',
            'getCategories': 'products/getCategories',
        })
    },
    created() {
        this.fillProducts()
        this.fillAllCategories()
    }
}
</script>

<style scoped>
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

.table-responsive {
    overflow: hidden;
}

.nav-link {
    display: inline;
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

.product_pictre {
    width: 100px;
    height: 100px;
}

.product_pictre img {
    width: 100px;
    height: 100px;
    object-fit: cover;
}
</style>
